const HeartCheckV8 = (() => {
  function riskCount(d) {
    return [d.diabetes,d.hypertension,d.smoking,d.dyslipidemia,d.ckd,d.familyHistory,d.highLpa].filter(Boolean).length;
  }
  function ageAtLeast40(band){ return band !== 'lt40'; }
  function evaluate(d){
    if(d.symptoms){
      return {stop:true,title:'แบบประเมินนี้ไม่เหมาะกับผู้ที่มีอาการ',text:'เมื่อมีเจ็บแน่นหน้าอก เหนื่อยผิดปกติ หน้ามืด/เป็นลม หรืออาการขณะพัก เป้าหมายควรเป็นการประเมินเพื่อวินิจฉัย ไม่ใช่การเลือก screening test เอง กรุณาพบแพทย์; หากอาการรุนแรงหรือเกิดขณะพักให้ไป ER'};
    }
    if(d.knownAscvd){
      return {stop:true,title:'คุณไม่ใช่กลุ่ม screening แล้ว',text:'หากเคยมี MI, PCI/stent, CABG, known CAD, atherosclerotic stroke/TIA หรือ PAD การตรวจและการติดตามควรเป็น secondary prevention และ disease follow-up โดยแพทย์'};
    }
    const n = riskCount(d);
    const major = d.diabetes || d.ckd || d.ldl190;
    const cacDiscuss = ageAtLeast40(d.ageBand) && (n >= 1 || d.ldl190);
    const tests = [
      {name:'ตรวจเลือด',status:'good',label:'ควรเริ่มตรวจ',reason:'ใช้ประเมินปัจจัยเสี่ยงที่แก้ไขได้ แม้จะไม่ได้เห็นหลอดเลือดตีบโดยตรง'},
      {name:'EKG',status:'no',label:'ไม่ใช่ routine เพื่อหาตีบ',reason:'EKG ปกติไม่ได้ตัด coronary stenosis และไม่ใช่การตรวจหลักเพื่อ screening หลอดเลือดตีบในคนไม่มีอาการ'},
      {name:'Echo',status:'no',label:'ยังไม่จำเป็นเป็น routine',reason:'Echo ดูโครงสร้าง ลิ้นหัวใจ และการบีบตัว แต่ไม่ได้ใช้ดู plaque หรือ % หลอดเลือดหัวใจตีบโดยตรง'},
      {name:'EST',status: major ? 'maybe' : 'no',label: major ? 'อาจพิจารณาบางกรณี' : 'ยังไม่ใช่ routine',reason: major ? 'ในคนที่มีความเสี่ยงสูงต่อ silent ischemia บางกลุ่ม อาจมีเหตุผล แต่ไม่ควรทำเพียงเพราะกังวลเรื่องตีบ' : 'ในคนไม่มีอาการทั่วไป EST ไม่ใช่ routine screening และไม่ได้เห็นหลอดเลือดโดยตรง'},
      {name:'Calcium Score',status: cacDiscuss ? 'maybe' : 'no',label: cacDiscuss ? 'อาจพิจารณา' : 'ยังไม่จำเป็น',reason: cacDiscuss ? 'เหมาะสำหรับคุยกับแพทย์เพื่อดู calcified plaque และช่วย refine risk โดยเฉพาะเมื่อผลจะเปลี่ยนแผนป้องกัน' : 'หากอายุน้อยและไม่มีปัจจัยเสี่ยงเด่น โดยทั่วไปควรเริ่มจาก risk-factor assessment ก่อน'},
      {name:'CTA / CCTA',status:'no',label:'ไม่ใช่ routine screening',reason:'CCTA เห็น plaque และประเมิน % stenosis ได้ แต่ AUC ไม่สนับสนุนให้ใช้เป็น routine screening ในคนไม่มีอาการทั่วไป'},
      {name:'CAG / สวนหัวใจ',status:'no',label:'ไม่ใช้เพื่อ screening',reason:'เป็น invasive coronary angiography และควรมีข้อบ่งชี้ทางการแพทย์ชัดเจนจากอาการหรือผลตรวจอื่น'}
    ];
    const blood = [
      {name:'Lipid profile',reason:'Total cholesterol, LDL-C, HDL-C, triglyceride'},
      {name:'Glucose หรือ HbA1c',reason:'คัดกรองเบาหวานและภาวะน้ำตาลผิดปกติ'},
      {name:'Creatinine / eGFR',reason:'ประเมินการทำงานไต ซึ่งสัมพันธ์กับความเสี่ยงหัวใจ'}
    ];
    if(d.neverLpa) blood.push({name:'Lp(a) อย่างน้อย 1 ครั้ง',reason:'แนวทาง ACC/AHA 2026 สนับสนุนการตรวจอย่างน้อยหนึ่งครั้งในชีวิต'});
    if(d.highLpa) blood.push({name:'ทบทวนผล Lp(a) เดิม',reason:'Lp(a) สูงเป็น risk-enhancing factor และควรเข้มงวดกับปัจจัยเสี่ยงอื่น'});
    let summary='ควรเริ่มจากการประเมินปัจจัยเสี่ยงและตรวจเลือดก่อน';
    if(cacDiscuss) summary += ' และ Calcium Score เป็นการตรวจพิเศษที่เหมาะจะ “คุยกับแพทย์” มากที่สุดในบริบท screening';
    else summary += ' และยังไม่จำเป็นต้องรีบตรวจภาพหลอดเลือดหัวใจ';
    summary += ' ส่วน Echo, CCTA และ CAG ไม่ใช่ routine screening สำหรับคนไม่มีอาการทั่วไป';
    let bottom = summary;
    if(d.ldl190) bottom += ' ทั้งนี้ LDL-C ≥190 mg/dL เป็นเหตุให้ควรคุยเรื่องการลด LDL โดยไม่ควรรอ Calcium Score เพื่อตัดสินใจว่าจะป้องกันหรือไม่';
    return {stop:false,tests,blood,summary,bottom,cacDiscuss};
  }
  return {evaluate};
})();
