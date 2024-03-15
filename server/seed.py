# Remote library imports
import requests
import re

# Local imports
from app import app
from models import db, Medication, MetricType

def extract_description(description):
    match = re.search(r"DESCRIPTION\s*(.*)", description, re.IGNORECASE)
    if match:
        return match.group(1).strip()
    else:
        return description

def extract_indications(indication):
    match = re.search(r"INDICATIONS\s+AND\s+USAGE\s*(.*)", indication, re.IGNORECASE)
    if match:
        return match.group(1).strip()
    else:
        match = re.search(r"Use s\s*(.*)", indication, re.IGNORECASE)
        if match:
            return match.group(1).strip()
        else:
            match = re.search(r"Uses\s*(.*)", indication, re.IGNORECASE)
            if match:
                return match.group(1).strip()
            else:
                match = re.search(r"INDICATION\s+AND\s+USAGE\s*(.*)", indication, re.IGNORECASE)
                if match:
                    return match.group(1).strip()
                else:
                    return indication

def extract_dosage(dosage):
    match = re.search(r"DOSAGE\s+AND\s+ADMINISTRATION\s*(.*)", dosage, re.IGNORECASE)
    if match:
        return match.group(1).strip()
    else:
        return dosage

def extract_warnings(warning):
    match = re.search(r"WARNINGS\s+AND\s+PRECAUTIONS\s*(.*)", warning, re.IGNORECASE)
    if match:
        return match.group(1).strip()
    else:
        return warning

def extract_reactions(reaction):
    match = re.search(r"ADVERSE\s+REACTIONS\s*(.*)", reaction, re.IGNORECASE)
    if match:
        return match.group(1).strip()
    else:
        return reaction

def extract_pregnancy(pregnancy):
    match = re.search(r"RISK\s+SUMMARY\s*(.*)", pregnancy, re.IGNORECASE)
    if match:
        return match.group(1).strip()
    else:
        match = re.search(r"PREGNANCY\s+EXPOSURE\s+REGISTRY\s*(.*)", pregnancy, re.IGNORECASE)
        if match:
            return match.group(1).strip()
        else:
            match = re.search(r"PREGNANCY\s*(.*)", pregnancy, re.IGNORECASE)
            if match:
                return match.group(1).strip()
            else:
                return pregnancy

def extract_contraindications(contraindications):
    match = re.search(r"CONTRAINDICATIONS\s*(.*)", contraindications, re.IGNORECASE)
    if match:
        return match.group(1).strip()
    else:
        return contraindications
            
if __name__ == '__main__':
    with app.app_context():
        print('Clearing tables...')
        # Medication.query.delete()
        MetricType.query.delete()
        
        # print("Seeding medications...")
        # meds_to_fetch = ['"Synthroid"', '"Lipitor"', '"Qbrelis"', '"Zestril"','"METFORMIN%20HYDROCHLORIDE"', '"Norvasc"', '"Lopressor"', '"TOPROL XL"', '"Prilosec"', '"ZOCOR"', '"Proventil HFA"', '"VENTOLIN HFA"', '"Neurontin"', '"Zithromax"', '"Zoloft"', '"Celexa"', '"Lasix"', '"Lexapro"', '"FLONASE ALLERGY RELIEF"', '"tramadol hydrochloride"', '"Protonix Delayed-Release"', '"Warfarin Sodium"', '"Trazodone Hydrochloride"', '"SINGULAIR"', '"Coreg"', '"Advil"', '"Motrin IB"', '"PRAVASTATIN SODIUM"', '"Cymbalta"', '"OxyContin"', '"Percocet"', '"Meloxicam"', '"ADVAIR DISKUS"', '"Zantac 360"', '"Effexor XR"', '"CELEBREX"', '"Norco"', '"Prozac"', '"ABILIFY"', '"SYMBICORT"', '"Xanax"', '"Nexium 24HR"', '"Crestor"', '"Cardizem"', '"Effexor XR"', '"Prevacid"', '"Flagyl"', '"FENTANYL"', '"SEROQUEL"', '"Oxybutynin Chloride"', '"Spiriva Respimat"', '"Lotensin"', '"Strattera"', '"Aricept"', '"RESTORIL"', '"Humalog"', '"Suboxone"', '"LIDODERM"', '"CHANTIX"', '"Zyprexa"', '"Isosorbide Mononitrate"', '"Viagra"', '"Latuda"', '"REMERON"', '"Vasotec"', '"Clonidine Hydrochloride"', '"PAXIL"', '"Reglan"', '"Ambien"', '"Namenda"', '"Pristiq Extended-Release"', '"Cipro"', '"Actos"', '"Kenalog"', '"Microgestin 1/20"', '"JANUVIA"', '"Aricept"', '"Ondansetron Hydrochloride"', '"PAMELOR"', '"Methotrexate"', '"NITROGLYCERIN"', '"Amoxicillin"', '"Hydrochlorothiazide"', '"TENORMIN"', '"Glipizide"', '"Lantus"', '"WELLBUTRIN XL"']

        # required_data = ["boxed_warning", "description", "indications_and_usage", "dosage_and_administration", "warnings_and_cautions", "adverse_reactions", "drug_interactions", "pregnancy", "contraindications"]
        # openfda_data = ["brand_name", "generic_name", "route"]
        
        # antihypertensives = ['LOSARTAN POTASSIUM', "CLONIDINE HYDROCHLORIDE"]
        # ace_inhibitors = ['LISINOPRIL', 'ENALAPRIL MALEATE', 'BENAZEPRIL HYDROCHLORIDE']
        # statins = ['ATORVASTATIN CALCIUM', 'SIMVASTATIN', 'PRAVASTATIN SODIUM', 'ROSUVASTATIN']
        # antidiabetic = ['METFORMIN HYDROCHLORIDE', 'PIOGLITAZONE', 'INSULIN GLARGINE', 'INSULIN LISPRO', "GLIPIZIDE"]
        # beta_blockers = ['METOPROLOL TARTRATE', 'METOPROLOL SUCCINATE', 'CARVEDILOL', 'ATENOLOL']
        # proton_pump_inhibitors = ['OMEPRAZOLE MAGNESIUM', 'PANTOPRAZOLE SODIUM', 'ESOMEPRAZOLE MAGNESIUM', 'FAMOTIDINE', 'LANSOPRAZOLE', 'METOCLOPRAMIDE HYDROCHLORIDE']
        # diuretics = ['FUROSEMIDE', 'HYDROCHLOROTHIAZIDE']
        # corticosteroids = ['FLUTICASONE PROPIONATE', 'TRIAMCINOLONE ACETONIDE', 'FLUTICASONE PROPIONATE AND SALMETEROL', 'BUDESONIDE AND FORMOTEROL FUMARATE DIHYDRATE']
        # bronchodilator= ['ALBUTEROL SULFATE', 'TIOTROPIUM BROMIDE INHALATION SPRAY']
        # anticonvulsants = ['GABAPENTIN']
        # opioid_analgesics = ['TRAMADOL HYDROCHLORIDE', 'FENTANYL', 'OXYCODONE HYDROCHLORIDE', 'OXYCODONE/APAP', 'HYDROCODONE/APAP']
        # anticoagulants = ['WARFARIN SODIUM']
        # atypical_antipsychotics = ['LURASIDONE HYDROCHLORIDE', 'TRAZODONE HYDROCHLORIDE', 'QUETIAPINE', 'OLANZAPINE']
        # allergy_relief = ['MONTELUKAST SODIUM']
        # NSAIDs = ['IBUPROFEN', 'MELOXICAM', 'CELECOXIB']
        # antidepressants = ['ATOMOXETINE HYDROCHLORIDE', 'BUPROPION HYDROCHLORIDE', 'DULOXETINE HYDROCHLORIDE', 'SERTRALINE HYDROCHLORIDE', 'CITALOPRAM', 'ESCITALOPRAM', 'FLUOXETINE HYDROCHLORIDE', 'TRAZODONE HYDROCHLORIDE', 'VENLAFAXINE HYDROCHLORIDE', 'DESVENLAFAXINE SUCCINATE', 'MIRTAZAPINE', 'NORTRIPTYLINE HYDROCHLORIDE', 'PAROXETINE HYDROCHLORIDE']
        # antibiotics = ['CIPROFLOXACIN HYDROCHLORIDE', 'AZITHROMYCIN DIHYDRATE', 'AMOXICILLIN', 'METRONIDAZOLE']
        # antianxiety = ['ALPRAZOLAM', 'TEMAZEPAM']
        # calcium_channel_blockers = ['DILTIAZEM HYDROCHLORIDE', 'AMLODIPINE BESYLATE']
        # vasodilators = ['SILDENAFIL CITRATE', 'NITROGLYCERIN']
        # antispasmotics = ['OXYBUTYNIN CHLORIDE']


        # base_url = "https://api.fda.gov/drug/label.json?search=openfda.brand_name.exact:"
        
        # med_data = []
        # for med in meds_to_fetch:
        #     url = f"{base_url}{med}"
        #     response = requests.get(url)
        
        #     if response.status_code == 200:
        #         data = response.json()
        #         print(data["results"][0]["openfda"]["generic_name"])
        #         med_data.append(data["results"][0])
        #     else:
        #         print("Error:", response.status_code)

        # medications = []
        # for med_resp in med_data:
        #     new_medication = Medication()

        #     for x in required_data:
        #         if x not in med_resp.keys():
        #             setattr(new_medication, x, None)
        #         else:
        #             setattr(new_medication, x, str(med_resp[x][0]))

        #     for y in openfda_data:
        #         if y not in med_resp["openfda"].keys():
        #             setattr(new_medication, y, None)
        #         elif y == "generic_name":
        #             setattr(new_medication, y, str(med_resp["openfda"][y][0]).lower())
        #         elif y == "brand_name":
        #             setattr(new_medication, y, str(med_resp["openfda"][y][0]).title())
        #         else:
        #             setattr(new_medication, y, str(med_resp["openfda"][y][0]))
            
        #     # Data Cleaning
        #     description = med_resp.get("description")
        #     if description:
        #         setattr(new_medication, "description", extract_description(str(description[0])))

        #     indication = med_resp.get("indications_and_usage")[0]
        #     setattr(new_medication, "indications_and_usage", extract_indications(str(indication)))

        #     dosage = med_resp.get("dosage_and_administration")
        #     if dosage:
        #         setattr(new_medication, "dosage_and_administration", extract_dosage(str(dosage[0])))
            
        #     warning = med_resp.get("warnings_and_cautions")
        #     if warning:
        #         setattr(new_medication,"warnings_and_cautions", extract_warnings(str(warning[0])))
            
        #     reaction = med_resp.get("adverse_reactions")
        #     if reaction:
        #         setattr(new_medication,"adverse_reactions", extract_reactions(str(reaction[0])))
            
        #     pregnancy = med_resp.get("pregnancy")
        #     if pregnancy:
        #         setattr(new_medication,"pregnancy", extract_pregnancy(str(pregnancy[0])))
            
        #     contraindications = new_medication.contraindications
        #     if contraindications:
        #         setattr(new_medication,"contraindications", extract_contraindications(str(contraindications)))

        #     # Route cleaning
        #     if med_resp["openfda"]["brand_name"] == "Advil":
        #         setattr(new_medication, "route", "ORAL")
        #     elif med_resp["openfda"]["brand_name"] == "Zithromax":
        #         setattr(new_medication, "route", "ORAL")
        #     elif med_resp["openfda"]["brand_name"] == "Humalog":
        #         setattr(new_medication, "route", "SUBCUTANEOUS")

        #     # Brand name cleaing
        #     if med_resp["openfda"]["generic_name"] == 'OXYBUTYNIN CHLORIDE':
        #         setattr(new_medication, "brand_name", "Ditropan")
        #     elif med_resp["openfda"]["generic_name"] == 'ISOSORBIDE MONONITRATE':
        #         setattr(new_medication, "brand_name", "Imdur")

        #     # Adding pharm_classes
        #     if med_resp["openfda"]["generic_name"][0] in antihypertensives:
        #         setattr(new_medication, "pharm_class", "Antihypertensive")
        #     elif med_resp["openfda"]["generic_name"][0] in statins:
        #         setattr(new_medication, "pharm_class", "Antihyperlipidemic")
        #     elif med_resp["openfda"]["generic_name"][0] in antidiabetic:
        #         setattr(new_medication, "pharm_class", "Antidiabetic")
        #     elif med_resp["openfda"]["generic_name"][0] in beta_blockers:
        #         setattr(new_medication, "pharm_class", "Beta Blocker")
        #     elif med_resp["openfda"]["generic_name"][0] in proton_pump_inhibitors:
        #         setattr(new_medication, "pharm_class", "Anti-GERD")
        #     elif med_resp["openfda"]["generic_name"][0] in diuretics:
        #         setattr(new_medication, "pharm_class", "Diuretic")
        #     elif med_resp["openfda"]["generic_name"][0] in corticosteroids:
        #         setattr(new_medication, "pharm_class", "Corticosteroid")
        #     elif med_resp["openfda"]["generic_name"][0] in bronchodilator:
        #         setattr(new_medication, "pharm_class", "Bronchodilator")
        #     elif med_resp["openfda"]["generic_name"][0] in anticonvulsants:
        #         setattr(new_medication, "pharm_class", "Anticonvulsant")
        #     elif med_resp["openfda"]["generic_name"][0] in opioid_analgesics:
        #         setattr(new_medication, "pharm_class", "Opioid Analgesic")
        #     elif med_resp["openfda"]["generic_name"][0] in anticoagulants:
        #         setattr(new_medication, "pharm_class", "Anticoagulant")
        #     elif med_resp["openfda"]["generic_name"][0] in atypical_antipsychotics:
        #         setattr(new_medication, "pharm_class", "Atypical Antipsychotic")
        #     elif med_resp["openfda"]["generic_name"][0] in allergy_relief:
        #         setattr(new_medication, "pharm_class", "Allergy Relief")
        #     elif med_resp["openfda"]["generic_name"][0] in NSAIDs:
        #         setattr(new_medication, "pharm_class", "Nonsteroidal Anti-inflammatory")
        #     elif med_resp["openfda"]["generic_name"][0] in antidepressants:
        #         setattr(new_medication, "pharm_class", "Antidepressant")
        #     elif med_resp["openfda"]["generic_name"][0] in antibiotics:
        #         setattr(new_medication, "pharm_class", "Antibiotic")
        #     elif med_resp["openfda"]["generic_name"][0] in antianxiety:
        #         setattr(new_medication, "pharm_class", "Antianxiety - Benzodiazepine")
        #     elif med_resp["openfda"]["generic_name"][0] in calcium_channel_blockers:
        #         setattr(new_medication, "pharm_class", "Calcium Channel Blocker")
        #     elif med_resp["openfda"]["generic_name"][0] in vasodilators:
        #         setattr(new_medication, "pharm_class", "Vasodilator")
        #     elif med_resp["openfda"]["generic_name"][0] == 'LEVOTHYROXINE SODIUM':
        #         setattr(new_medication, "pharm_class", "Hypothyroidism")
        #     elif med_resp["openfda"]["generic_name"][0] == 'ONDANSETRON HYDROCHLORIDE':
        #         setattr(new_medication, "pharm_class", "Antiemetic")
        #     elif med_resp["openfda"]["generic_name"][0] in antispasmotics:
        #         setattr(new_medication, "pharm_route", "Antispasmotic")
        #     elif med_resp["openfda"]["generic_name"][0] in ace_inhibitors:
        #         setattr(new_medication, "pharm_class", "Antihypertensive - ACE Inhibitor")
            
        #     medications.append(new_medication)

        # db.session.add_all(medications)

        print('Seeding metric types')

        metric_types = []

        BP = MetricType(metric_type = 'Blood Pressure', green_params = 90, yellow_params = 125, red_params = 161, units='mmHg')
        metric_types.append(BP)
        
        # DBP = MetricType(metric_type = 'Diasystolic Blood Pressure', green_params = 60, yellow_params = 81, red_params = 91, units='mmHg')
        # metric_types.append(DBP)

        HR = MetricType(metric_type = 'Heart Rate', green_params = 60, yellow_params = 101, red_params = 121, units='beats per minute')
        metric_types.append(HR)
        
        RR = MetricType(metric_type = 'Respiratory Rate', green_params = 12, yellow_params = 21, red_params = 30, units='breaths per minute')
        metric_types.append(RR)
        
        PAIN = MetricType(metric_type = 'Pain Level', green_params = 0, yellow_params = 4, red_params = 7, units='out of 10')
        metric_types.append(PAIN)

        BG = MetricType(metric_type = 'Blood Glucose', green_params = 80, yellow_params = 100, red_params = 150, units='mg/dL')
        metric_types.append(BG)

        MED = MetricType(metric_type = 'Medication Taken')
        metric_types.append(MED)

        LF = MetricType(metric_type = 'Lifestyle Factors')
        metric_types.append(LF)

        SYM = MetricType(metric_type = 'Symptom')
        metric_types.append(SYM)

        db.session.add_all(metric_types)

        db.session.commit()