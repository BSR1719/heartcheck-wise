const HeartCheckRules = (() => {
  const numberOrNull = (value) => (value === "" || value === null || typeof value === "undefined") ? null : Number(value);

  function interpretLabs(data) {
    const out = [];

    if (data.sbp !== null) {
      if (data.sbp >= 140) out.push({level:"warn", text:`ความดันตัวบน ${data.sbp} mmHg: สูง ควรวัดซ้ำอย่างถูกวิธีและประเมินร่วมกับบุคลากรทางการแพทย์ ไม่ควรวินิจฉัยความดันสูงจากค่าครั้งเดียว`});
      else if (data.sbp >= 130) out.push({level:"warn", text:`ความดันตัวบน ${data.sbp} mmHg: สูงกว่าระดับที่เหมาะสม ควรวัดซ้ำหลายครั้งและดูความเสี่ยงโดยรวม`});
      else out.push({level:"ok", text:`ความดันตัวบน ${data.sbp} mmHg: ยังไม่พบค่าตัวบนสูงเด่นจากข้อมูลครั้งนี้`});
    }

    if (data.ldl !== null) {
      if (data.ldl >= 190) out.push({level:"danger", text:`LDL-C ${data.ldl} mg/dL: สูงมาก ควรพบแพทย์เพื่อประเมินสาเหตุ รวมถึง familial hypercholesterolemia และวางแผนลด LDL-C โดยไม่ควรรอ Calcium Score เพื่อชะลอการรักษา`});
      else if (data.ldl >= 160) out.push({level:"warn", text:`LDL-C ${data.ldl} mg/dL: สูง เป็นปัจจัยที่เพิ่มความเสี่ยงและควรนำไปประกอบการประเมินป้องกันโรคหัวใจ`});
      else if (data.ldl >= 130) out.push({level:"warn", text:`LDL-C ${data.ldl} mg/dL: อาจสูงกว่าที่เหมาะสม เป้าหมายจริงขึ้นกับความเสี่ยงโดยรวมและโรคร่วม`});
      else out.push({level:"ok", text:`LDL-C ${data.ldl} mg/dL: ไม่พบความสูงเด่นจากตัวเลขนี้เพียงอย่างเดียว แต่เป้าหมาย LDL-C ขึ้นกับความเสี่ยงโดยรวม`});
    }

    if (data.hba1c !== null) {
      if (data.hba1c >= 6.5) out.push({level:"danger", text:`HbA1c ${data.hba1c}%: อยู่ในช่วงที่เข้าได้กับเบาหวาน หากยังไม่เคยได้รับการวินิจฉัยควรได้รับการยืนยันตามเกณฑ์ เว้นแต่มีภาวะน้ำตาลสูงชัดเจน`});
      else if (data.hba1c >= 5.7) out.push({level:"warn", text:`HbA1c ${data.hba1c}%: อยู่ในช่วง prediabetes ควรปรับพฤติกรรมและติดตามตามความเหมาะสม`});
      else out.push({level:"ok", text:`HbA1c ${data.hba1c}%: ยังไม่อยู่ในช่วง prediabetes ตามเกณฑ์ทั่วไป`});
    }

    if (data.egfr !== null) {
      if (data.egfr < 30) out.push({level:"danger", text:`eGFR ${data.egfr}: การทำงานของไตลดลงมาก ควรได้รับการประเมินโดยแพทย์`});
      else if (data.egfr < 60) out.push({level:"warn", text:`eGFR ${data.egfr}: หากความผิดปกตินี้คงอยู่อย่างน้อย 3 เดือน อาจเข้าได้กับโรคไตเรื้อรังและสัมพันธ์กับความเสี่ยงหัวใจที่สูงขึ้น`});
      else out.push({level:"ok", text:`eGFR ${data.egfr}: ยังไม่พบการลดลงเด่นจากค่าครั้งนี้ แต่ค่า eGFR ปกติครั้งเดียวไม่ได้ตัดโรคไตทุกชนิด`});
    }

    if (data.lpa === null) {
      out.push({level:"warn", text:"Lp(a): หากยังไม่เคยตรวจ ควรพิจารณาตรวจอย่างน้อย 1 ครั้งในวัยผู้ใหญ่"});
    } else {
      const high = data.lpaUnit === "nmol" ? data.lpa >= 125 : data.lpa >= 50;
      const unitText = data.lpaUnit === "nmol" ? "nmol/L" : "mg/dL";
      if (high) out.push({level:"warn", text:`Lp(a) ${data.lpa} ${unitText}: อยู่ในช่วง risk-enhancing ควรให้ความสำคัญกับการจัดการ LDL-C ความดัน เบาหวาน และการสูบบุหรี่`});
      else out.push({level:"ok", text:`Lp(a) ${data.lpa} ${unitText}: ยังไม่ถึง threshold risk-enhancing ที่ใช้ใน guideline ปัจจุบัน`});
    }

    return out;
  }

  function hasMajorActionTrigger(data) {
    return (data.ldl !== null && data.ldl >= 190) ||
      (data.hba1c !== null && data.hba1c >= 6.5) ||
      (data.egfr !== null && data.egfr < 30);
  }

  function hasRiskEnhancerOrCondition(data) {
    const lpaHigh = data.lpa !== null && (data.lpaUnit === "nmol" ? data.lpa >= 125 : data.lpa >= 50);
    return data.smoking || data.diabetes || data.hypertension || data.familyHistory || data.ckd ||
      (data.ldl !== null && data.ldl >= 160) || (data.egfr !== null && data.egfr < 60) || lpaHigh;
  }

  function cacDiscussionCandidate(data) {
    const ageOK = data.sex === "male" ? data.age >= 40 : data.age >= 45;
    return !data.knownASCVD && !data.symptomatic && !data.acute && ageOK &&
      (hasRiskEnhancerOrCondition(data) || data.plaqueConcern) &&
      !(data.ldl !== null && data.ldl >= 190);
  }

  function evaluate(data) {
    data.sbp = numberOrNull(data.sbp);
    data.ldl = numberOrNull(data.ldl);
    data.hba1c = numberOrNull(data.hba1c);
    data.egfr = numberOrNull(data.egfr);
    data.lpa = numberOrNull(data.lpa);
    data.lpaUnit = data.lpaUnit === "nmol" ? "nmol" : "mg";

    const labResults = interpretLabs(data);
    const cacCandidate = cacDiscussionCandidate(data);

    if (data.knownASCVD) {
      return {
        category:"red",
        actionLevel:"known-ascvd",
        title:"มีโรคหลอดเลือดหัวใจ/ASCVD อยู่แล้ว — ไม่ใช้เส้นทาง screening",
        text:"หากเคยกล้ามเนื้อหัวใจตาย ใส่ stent ผ่าตัด bypass มี known coronary artery disease, atherosclerotic stroke/TIA หรือ peripheral arterial disease ควรเข้าสู่เส้นทาง secondary prevention และติดตามกับแพทย์",
        advice:[
          "นัดพบแพทย์ที่ดูแลเพื่อทบทวน secondary prevention และเป้าหมาย LDL-C/ความดัน/เบาหวานตามความเสี่ยง",
          "ไม่ควรใช้แบบประเมิน screening นี้เพื่อตัดสินใจว่าจะรักษาหรือไม่",
          "หากมีอาการใหม่หรืออาการรุนแรง ให้ประเมินอาการก่อนเสมอ"
        ],
        labs:labResults,
        cacEligible:false,
        tests:{
          labs:["consider","ตรวจติดตามตามแผน secondary prevention และโรคร่วม"],
          cac:["not-routine","CAC ไม่ใช่เครื่องมือหลักในการตัดสินใจรักษาในผู้ที่มี known ASCVD"],
          echo:["consider","ใช้เมื่อมี clinical question เรื่องโครงสร้างหรือการทำงานของหัวใจ"],
          est:["consider","ใช้ตามอาการและ clinical question"],
          ccta:["consider","ใช้ตามข้อบ่งชี้เฉพาะ ไม่ใช่ routine screening"],
          cag:["consider","ใช้เมื่อมีข้อบ่งชี้ชัดเจนและบริบทที่ผลจะเปลี่ยนการรักษา"]
        }
      };
    }

    if (data.acute) {
      return {
        category:"red",
        actionLevel:"emergency",
        title:"ควรประเมินฉุกเฉิน",
        text:"อาการปัจจุบันสำคัญกว่าการตรวจคัดกรอง ควรไปโรงพยาบาล/ER ก่อน",
        advice:[
          "ไปโรงพยาบาล/ER เพื่อประเมินอาการก่อน ไม่ควรรอทำ screening package",
          "อย่าใช้ Calcium Score เพื่อประเมินภาวะหัวใจขาดเลือดเฉียบพลัน"
        ],
        labs:labResults,
        cacEligible:false,
        tests:{
          labs:["consider","ให้แพทย์เลือกตามบริบทฉุกเฉิน"],
          cac:["not-routine","ไม่ใช้ตัดภาวะหัวใจขาดเลือดเฉียบพลัน"],
          echo:["consider","ให้แพทย์เลือกตามอาการและผลตรวจเบื้องต้น"],
          est:["not-routine","ไม่ใช่การตรวจฉุกเฉิน"],
          ccta:["consider","ให้แพทย์เลือกตามบริบท"],
          cag:["consider","ทำตามข้อบ่งชี้ของ ACS/โรคหัวใจ ไม่ใช่จากความกังวลเพียงอย่างเดียว"]
        }
      };
    }

    if (data.symptomatic) {
      return {
        category:"red",
        actionLevel:"symptomatic",
        title:"มีอาการ — ควรพบแพทย์ก่อนเลือกการตรวจ",
        text:"เมื่อมีอาการ เป้าหมายคือหาสาเหตุ ไม่ควรเลือก Echo, EST หรือ Calcium Score เองจาก package",
        advice:[
          "พบแพทย์เพื่อประเมินลักษณะอาการและโอกาสเป็นโรคหลอดเลือดหัวใจก่อน",
          "ECG มักเป็นส่วนหนึ่งของการประเมินเบื้องต้นในผู้มีอาการ",
          "EST, stress imaging หรือ CCTA ควรเลือกตาม clinical likelihood และคำถามทางคลินิก"
        ],
        labs:labResults,
        cacEligible:false,
        tests:{
          labs:["consider","อาจมีประโยชน์ร่วมกับการประเมินทางคลินิก"],
          cac:["not-routine","ไม่ใช่การตรวจหลักเพื่อหาสาเหตุของอาการ"],
          echo:["consider","ใช้เมื่อมีคำถามเรื่องโครงสร้าง/การบีบตัว/ลิ้นหัวใจ"],
          est:["consider","อาจใช้เมื่อมีคำถามเรื่อง ischemia หรือสมรรถนะขณะออกแรง"],
          ccta:["consider","อาจใช้เพื่อประเมิน coronary anatomy ตาม clinical likelihood"],
          cag:["not-routine","ไม่ใช่ screening; ต้องมีข้อบ่งชี้ชัดเจน"]
        }
      };
    }

    let category = "green";
    let actionLevel = "baseline";
    let title = "เริ่มจากประเมินปัจจัยเสี่ยงพื้นฐาน";

    if (hasMajorActionTrigger(data)) {
      category = "orange";
      actionLevel = "clinician-priority";
      title = "มีผลตรวจสำคัญที่ควรพบแพทย์เพื่อวางแผนต่อ";
    } else if (hasRiskEnhancerOrCondition(data)) {
      category = "yellow";
      actionLevel = "risk-review";
      title = "มีปัจจัยเสี่ยงที่ควรประเมินและจัดการอย่างเป็นระบบ";
    }

    const advice = ["ติดตามปัจจัยเสี่ยงพื้นฐาน ได้แก่ ไขมัน น้ำตาล ความดัน และการทำงานของไตตามความเหมาะสม"];
    if (data.lpa === null) advice.push("หากยังไม่เคยตรวจ Lp(a) ควรพิจารณาตรวจอย่างน้อย 1 ครั้งในวัยผู้ใหญ่");
    if (data.ldl !== null && data.ldl >= 190) advice.push("LDL-C สูงมาก: ควรพบแพทย์เพื่อประเมินและวางแผนลด LDL-C โดยไม่ต้องรอ Calcium Score");
    else if (data.ldl !== null && data.ldl >= 160) advice.push("LDL-C สูง: ควรนำไปประกอบการประเมินความเสี่ยงและการตัดสินใจเรื่อง lipid-lowering therapy");
    if (data.hba1c !== null && data.hba1c >= 6.5) advice.push("HbA1c อยู่ในช่วงที่เข้าได้กับเบาหวาน: หากยังไม่เคยได้รับการวินิจฉัยควรได้รับการยืนยันตามเกณฑ์");
    if (data.egfr !== null && data.egfr < 60) advice.push("eGFR ต่ำ: ควรประเมินโรคไตเรื้อรังและความเสี่ยงหัวใจร่วมกัน");
    const lpaHigh = data.lpa !== null && (data.lpaUnit === "nmol" ? data.lpa >= 125 : data.lpa >= 50);
    if (lpaHigh) advice.push("Lp(a) สูง: ควรเข้มงวดกับปัจจัยเสี่ยงที่แก้ไขได้ โดยเฉพาะ LDL-C ความดัน เบาหวาน และบุหรี่");
    if (cacCandidate) advice.push("Calcium Score อาจเป็นหัวข้อที่ควรคุยกับแพทย์ หากหลังประเมินความเสี่ยงโดยรวมแล้วผล CAC จะช่วยเปลี่ยนการตัดสินใจด้านการป้องกัน");
    else advice.push("ถ้าไม่มีข้อบ่งชี้เฉพาะ ยังไม่ควรทำ Echo, EST, CCTA หรือ CAG แบบ routine เพียงเพราะต้องการตรวจให้ครบ");

    return {
      category,
      actionLevel,
      title,
      text: category === "green"
        ? "ถ้าไม่มีอาการและไม่มีปัจจัยเสี่ยงเด่น การประเมินปัจจัยเสี่ยงพื้นฐานและพฤติกรรมสำคัญกว่าการตรวจเครื่องมือแบบ routine"
        : "จัดการปัจจัยเสี่ยงก่อน และเลือกการตรวจเพิ่มเติมเฉพาะเมื่อผลมีโอกาสเปลี่ยนการดูแล",
      advice,
      labs:labResults,
      cacEligible:cacCandidate,
      tests:{
        labs:["recommended","Lipid profile, glucose/HbA1c และ creatinine/eGFR ตามความเหมาะสม"],
        cac:[cacCandidate?"consider":"not-routine", cacCandidate?"อาจใช้ช่วย reclassify risk หลังประเมินความเสี่ยงโดยรวมแล้ว และเมื่อผลจะเปลี่ยนการตัดสินใจ":"ยังไม่มีเหตุผลชัดเจนให้ทำเป็น routine จากข้อมูลที่มี"],
        echo:["not-routine","Echo ดูโครงสร้าง การบีบตัว และลิ้นหัวใจ ไม่ได้ใช้ screen coronary stenosis"],
        est:["not-routine","ไม่ควรทำ routine ในคนไม่มีอาการเพียงเพราะอายุถึงเกณฑ์"],
        ccta:["not-routine","ไม่ควรเป็น routine screening ในคนไม่มีอาการโดยไม่มี clinical question ชัดเจน"],
        cag:["not-routine","เป็น invasive test และไม่ใช่ screening test"]
      }
    };
  }

  return { evaluate, cacEligible: cacDiscussionCandidate };
})();
