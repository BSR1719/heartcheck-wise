const PackageChecker = (() => {
  function assess(items, state, result) {
    if (!items.length) return {type:"warn", lines:["ยังไม่ได้เลือกสิ่งที่อยู่ใน package"]};

    if (state.acute) {
      return {type:"danger", lines:["⛔ ตอนนี้มีอาการรุนแรง: อย่าใช้ package screening เป็นตัวตัดสินใจ ควรไปโรงพยาบาล/ER เพื่อประเมินอาการก่อน"]};
    }
    if (state.knownASCVD) {
      return {type:"warn", lines:["⚠️ คุณมี known ASCVD: ควรให้แพทย์กำหนดการตรวจตาม secondary prevention/อาการ ไม่ควรเลือก package screening แบบทั่วไป"]};
    }

    const lines = [];
    for (const item of items) {
      if (item === "labs") lines.push("✅ ตรวจเลือดพื้นฐาน: โดยทั่วไปมีเหตุผลสำหรับการประเมินปัจจัยเสี่ยง");
      if (item === "cac") lines.push(result.cacEligible
        ? "⚠️ Calcium Score: อาจเป็นประโยชน์ได้ แต่ควรถามก่อนว่าได้ประเมินความเสี่ยงโดยรวมแล้วหรือยัง และผล CAC จะเปลี่ยนการป้องกันอย่างไร"
        : "⚠️ Calcium Score: จากข้อมูลที่มี ยังไม่เห็นเหตุผลชัดเจนให้ทำเป็น routine ควรถามว่าผลจะเปลี่ยนการดูแลอย่างไร");
      if (item === "echo") lines.push("⚠️ Echo: ถ้าไม่มีคำถามเรื่องลิ้นหัวใจ การบีบตัว หรือโครงสร้างหัวใจ ควรถามเหตุผลเพิ่ม");
      if (item === "est") lines.push(state.symptomatic
        ? "⚠️ EST: อาจมีเหตุผลในบางกรณี แต่ควรให้แพทย์เลือกตามลักษณะอาการและ clinical likelihood"
        : "⚠️ EST: ในคนไม่มีอาการไม่ควรทำเป็น routine เพียงเพราะรวมอยู่ใน package");
      if (item === "ccta") lines.push(state.symptomatic
        ? "⚠️ CCTA: อาจเหมาะในผู้มีอาการบางรายตาม clinical likelihood"
        : "⚠️ CCTA: ไม่ควรเป็น routine screening ในคนไม่มีอาการโดยไม่มี clinical question ชัดเจน");
      if (item === "cag") lines.push("❌ CAG/สวนหัวใจ: ไม่ใช่ screening test และควรมีข้อบ่งชี้ทางการแพทย์ชัดเจน");
    }
    const type = lines.some(x => x.startsWith("❌") || x.startsWith("⛔")) ? "danger" : (lines.some(x => x.startsWith("⚠️")) ? "warn" : "good");
    return {type, lines};
  }
  return { assess };
})();
