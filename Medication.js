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
    treatment(hepatitis, "Treatment depends on the type of hepatitis. Antiviral medications may be needed for viral hepatitis, while supportive care is given for other types. Rest and hydration are crucial.").  
    recommendation(hepatitis, "Avoid alcohol and fatty foods. Get plenty of rest and stay hydrated. Seek medical advice for proper management.").  
    treatment(crohn_disease, "There is no cure, but treatment includes anti-inflammatory drugs, immune system suppressors, and sometimes surgery if complications occur.").  
    recommendation(crohn_disease, "Eat a low-fiber diet during flare-ups. Avoid dairy and high-fat foods. Stay hydrated and manage stress.").  
    treatment(ulcerative_colitis, "Treatment involves anti-inflammatory drugs, immune suppressors, and sometimes surgery to remove the colon in severe cases.").  
    recommendation(ulcerative_colitis, "Avoid dairy, high-fiber foods, and caffeine. Stay hydrated and maintain a balanced diet.").  
    treatment(irritable_bowel_syndrome, "Medications for diarrhea or constipation can help. Dietary changes and stress management are key to controlling symptoms.").  
    recommendation(irritable_bowel_syndrome, "Avoid triggers like caffeine, alcohol, and high-fat foods. Eat smaller, frequent meals and manage stress.").  
    treatment(diverticulitis, "Mild cases can be treated with antibiotics and a liquid diet. Severe cases may require hospitalization and surgery.").  
    recommendation(diverticulitis, "Follow a high-fiber diet when not in a flare-up. Avoid nuts and seeds if they trigger symptoms.").  
    treatment(gastroenteritis, "Stay hydrated by drinking plenty of fluids. If caused by bacteria, antibiotics might be needed. Severe cases may require IV fluids.").  
    recommendation(gastroenteritis, "Avoid dairy and fatty foods. Stick to a bland diet and get plenty of rest. Wash hands frequently to prevent spread.").  
    treatment(peptic_ulcer, "Acid-reducing medications like PPIs or H2 blockers can help. If H. pylori is present, antibiotics will be needed.").  
    recommendation(peptic_ulcer, "Avoid alcohol, caffeine, and spicy foods. Eat small, frequent meals to reduce irritation.").  
    treatment(celiac_disease, "The only treatment is a strict gluten-free diet. Nutritional supplements may be needed for deficiencies.").  
    recommendation(celiac_disease, "Avoid all gluten-containing foods. Read food labels carefully and consult a dietitian if necessary.").  
    treatment(gallbladder_inflammation, "Hospitalization may be required for IV antibiotics and pain management. Severe cases may need gallbladder removal surgery.").  
    recommendation(gallbladder_inflammation, "Avoid fatty foods and eat a low-fat diet. Maintain a healthy weight and stay hydrated.").  
    treatment(peritonitis, "Immediate hospitalization is needed. Treatment includes IV antibiotics and, in severe cases, surgery to remove infected tissue.").  
    recommendation(peritonitis, "Seek emergency medical care. Avoid eating or drinking until evaluated by a doctor.").  
    treatment(hernia, "Surgery is the only definitive treatment if the hernia is painful or growing. Supportive measures like wearing a truss may help temporarily.").  
    recommendation(hernia, "Avoid heavy lifting and straining. Maintain a healthy weight to reduce pressure on the abdomen.").  
    treatment(gastroesophageal_reflux_disease, "Medications like proton pump inhibitors or antacids can reduce acid reflux. Lifestyle changes are also recommended.").  
    recommendation(gastroesophageal_reflux_disease, "Avoid acidic, spicy, and fatty foods. Elevate the head of your bed and eat smaller meals.").  
    treatment(liver_cirrhosis, "Treatment focuses on managing symptoms and preventing further liver damage. Medications, lifestyle changes, and liver transplant in severe cases.").  
    recommendation(liver_cirrhosis, "Avoid alcohol and high-fat foods. Eat a balanced diet and monitor for complications like swelling or jaundice.").  
    treatment(meckel_diverticulum, "If symptomatic, surgery is required to remove the diverticulum. Mild cases may be managed with supportive care.").  
    recommendation(meckel_diverticulum, "Seek medical evaluation if experiencing rectal bleeding or abdominal pain.").  
    treatment(pyloric_stenosis, "Surgery (pyloromyotomy) is the only effective treatment. IV fluids may be given before surgery to correct dehydration.").  
    recommendation(pyloric_stenosis, "Seek urgent medical attention if a baby has projectile vomiting and weight loss.").  
    treatment(splenic_rupture, "Emergency surgery or embolization is often needed to stop internal bleeding. Blood transfusions may be required.").  
    recommendation(splenic_rupture, "Seek emergency medical care immediately. Avoid physical exertion if at risk.").  
    treatment(volvulus, "Emergency surgery is required to untwist the intestines and restore blood flow. Delay in treatment can cause life-threatening complications.").  
    recommendation(volvulus, "Seek emergency medical care if experiencing severe abdominal pain and vomiting.").  
    treatment(malabsorption_syndrome, "Treatment depends on the cause and may include dietary changes, enzyme supplements, and managing underlying conditions.").  
    recommendation(malabsorption_syndrome, "Follow a specialized diet based on deficiencies. Avoid foods that worsen symptoms and take supplements as needed.").  
    treatment(ischemic_colitis, "Mild cases resolve with supportive care like IV fluids and bowel rest. Severe cases may require surgery if blood flow isn't restored.").  
    recommendation(ischemic_colitis, "Stay hydrated and avoid solid foods until symptoms improve. Seek immediate medical attention for worsening pain.").  
    treatment(hirschsprung_disease, "Surgery is needed to remove the non-functioning part of the intestine. Supportive care is provided post-surgery.").  
    recommendation(hirschsprung_disease, "Monitor for symptoms like chronic constipation in newborns. Seek early medical evaluation if suspected.").  
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
