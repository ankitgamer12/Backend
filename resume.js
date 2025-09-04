const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const Resume = require("../models/Resume");

const puppeteer = require("puppeteer");
// create

router.post("/", auth, async (req, res) => {
  const { title, sections } = req.body;

  const resume = new Resume({ user: req.userId, title, sections });

  await resume.save();

  res.json(resume);
});

// list

router.get("/", auth, async (req, res) => {
  const list = await Resume.find({ user: req.userId }).sort({ createdAt: -1 });

  res.json(list);
});

// get one

router.get("/:id", auth, async (req, res) => {
  const r = await Resume.findById(req.params.id);

  if (!r || r.user.toString() !== req.userId)
    return res.status(404).json({ message: "Not found" });

  res.json(r);
});

// update

router.put("/:id", auth, async (req, res) => {
  const r = await Resume.findById(req.params.id);

  if (!r || r.user.toString() !== req.userId)
    return res.status(404).json({ message: "Not found" });

  r.title = req.body.title ?? r.title;

  r.sections = req.body.sections ?? r.sections;

  await r.save();

  res.json(r);
});

// delete

router.delete("/:id", auth, async (req, res) => {
  const r = await Resume.findById(req.params.id);

  if (!r || r.user.toString() !== req.userId)
    return res.status(404).json({ message: "Not found" });

  await r.remove();

  res.json({ message: "Deleted" });
});

module.exports = router;

router.get("/:id/export/pdf", auth, async (req, res) => {
  const resume = await Resume.findById(req.params.id);
  if (!resume || resume.user.toString() !== req.userId)
    return res.status(404).json({ message: "Not found" });
  const html = `
${resume.title}
${resume.sections
  .map(
    (s) => `
${s.heading}
${s.content}

`
  )
  .join("")} `;
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
  await browser.close();
  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="${
      resume.title || "resume"
    }.pdf"`,
  });
  res.send(pdfBuffer);
});
