const express = require("express");
const cors = require("cors");
const pl = require("tau-prolog");

const app = express();
const port = 3002;

app.use(express.json());
app.use(cors());

const prologProgram = `
    treatment(spontaneous_rupture_of_oesophagus, "You need emergency surgery to repair the rupture. In the meantime, doctors will give you IV fluids and antibiotics to prevent infection.").
    recommendation(spontaneous_rupture_of_oesophagus, "Seek emergency medical attention immediately. Avoid eating or drinking anything.").

    treatment(oesophagitis, "You'll likely need acid-reducing medications like proton pump inhibitors or antacids. Making some dietary changes can also help ease the discomfort.").
    recommendation(oesophagitis, "Avoid spicy and acidic foods. Elevate your head while sleeping. Quit smoking and alcohol.").

    treatment(gastric_outlet_obstruction, "Doctors may try to open the blockage with an endoscope. If that doesn't work, surgery might be necessary to fix the problem.").
    recommendation(gastric_outlet_obstruction, "Stay hydrated and avoid solid foods until symptoms are managed.").

    treatment(gastritis, "Taking antacids or acid blockers can help with the irritation. If H. pylori bacteria are causing it, you'll need antibiotics.").
    recommendation(gastritis, "Avoid NSAIDs, spicy foods, and alcohol. Eat smaller, more frequent meals.").

    treatment(gastric_ulcer, "You'll need acid-lowering medications like PPIs or H2 blockers. If an infection is involved, antibiotics will help clear it up.").
    recommendation(gastric_ulcer, "Avoid caffeine, alcohol, and smoking. Eat bland foods to avoid irritation.").

    treatment(intussusception_of_small_intestine, "Doctors usually try to fix this with an air or barium enema. If that doesn’t work, surgery might be necessary.").
    recommendation(intussusception_of_small_intestine, "Seek emergency medical care immediately.").

    treatment(intussusception_of_large_intestine, "Surgery is usually required to correct this. Doctors will also provide supportive care to manage symptoms.").
    recommendation(intussusception_of_large_intestine, "Seek immediate medical evaluation.").

    treatment(appendicitis, "You’ll need an appendectomy as soon as possible. Until then, avoid eating or drinking anything.").
    recommendation(appendicitis, "Avoid eating or drinking and seek immediate medical care.").

    treatment(cholelithiasis, "If the gallstones are causing pain, surgery to remove the gallbladder is the best option. In some cases, medication can help dissolve the stones.").
    recommendation(cholelithiasis, "Avoid fatty meals and maintain a healthy weight.").

    treatment(acute_pancreatitis, "You’ll need to stay in the hospital for IV fluids, pain management, and to address the cause. Resting your digestive system by not eating can help.").
    recommendation(acute_pancreatitis, "Fast (no eating) and stay hydrated. Seek urgent medical care.").    
`;

const session = pl.create();
session.consult(prologProgram, function(success) {
    if (!success) {
        console.error("Failed to load Prolog program");
    }
});

app.post("/", (req, res) => {
    const confirmed_disease = req.body.confirmed_disease.replace(/\s+/g, "_");
    
    session.query(`recommendation(${confirmed_disease}, Rec).`, function(success) {
        if (!success) {
            return res.status(404).json({ success: false, error: `No recommendation found for ${confirmed_disease}` });
        }

        session.answer(function(answer) {
            if (!answer || !answer.links || !answer.links.Rec) {
                return res.status(404).json({ success: false, error: `No recommendation data available for ${confirmed_disease}` });
            }

            // Convert Prolog term to JavaScript string
            const recommendation = answer.links.Rec.toJavaScript().join('');

            session.query(`treatment(${confirmed_disease}, Treat).`, function(success) {
                if (!success) {
                    return res.status(404).json({ success: false, error: `No treatment found for ${confirmed_disease}` });
                }

                session.answer(function(answer) {
                    if (!answer || !answer.links || !answer.links.Treat) {
                        return res.status(404).json({ success: false, error: `No treatment data available for ${confirmed_disease}` });
                    }

                    // Convert Prolog term to JavaScript string
                    const treatment = answer.links.Treat.toJavaScript().join('');
                    console.log(treatment);
                    console.log(recommendation);
                    res.json({ success: true, recommendation, treatment });
                });
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
