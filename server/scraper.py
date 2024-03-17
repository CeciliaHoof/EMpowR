from bs4 import BeautifulSoup
import requests

from app import app
from models import db, Medication

if __name__ == '__main__':
    with app.app_context():
        print('Clearing tables...')
        Medication.query.delete()
        
        print("Seeding medications...")
        drug_endpoints = ['synthroid-levoxyl-levothyroxine-342732', 'prinivil-zestril-lisinopril-342321', 'lipitor-atorvaliq-atorvastatin-342446', 'glucophage-metformin-342717', 'zocor-flolipid-simvastatin-342463', 'prilosec-omeprazole-341997', 'katerzia-norvasc-amlodipine-342372', 'lopressor-toprol-xl-metoprolol-342360', 'vicodin-hydrocodone-acetaminophen-343374', 'proventil-hfa-ventolin-hfa-albuterol-343426', 'microzide-hydrodiuril-hydrochlorothiazide-342412', 'cozaar-losartan-342323', 'neurontin-gralise-gabapentin-343011', 'zoloft-sertraline-342962', 'lasix-furoscix-furosemide-342423', 'tenormin-atenolol-342356', 'pravachol-pravastatin-342460', 'amoxil-amoxicillin-342473', 'prozac-fluoxetine-342955', 'celexa-citalopram-342958', 'oleptro-trazodone-d-342965', 'xanax-niravam-alprazolam-342896', 'flovent-diskus-armonair-digihaler-fluticasone-inhaled-343415', 'wellbutrin-aplenzin-bupropion-342954', 'coreg-cr-carvedilol-342357', 'kdur-slow-k-potassium-chloride-344450', 'ultram-conzip-tramadol-343324', 'protonix-pantoprazole-342001', 'singulair-montelukast-343440', 'lexapro-escitalopram-342961', 'prednisone-intensol-342747', 'crestor-ezallor-sprinkle-rosuvastatin-342467', 'mobic-vivlodex-meloxicam-343299', 'lantus-toujeo-insulin-glargine-999003', 'zestoretic-lisinopril-hydrochlorothiazide-342333', 'klonopin-clonazepam-342900', 'bayer-vazalore-aspirin-343279', 'plavix-clopidogrel-342141', 'glucotrol-glipizide-342708', 'coumadin-jantoven-warfarin-342182', 'flexeril-amrix-Flexmid-cyclobenzaprine-343338', 'humulin-r-novolin-r-insulin-regular-human-999007', 'flomax-tamsulosin-342839', 'ambien-cr-zolpidem-342931', 'mononessa-ortho-cyclen-norgestimate-ethinyl-estradiol-342754', 'cymbalta-irenka-duloxetine-342960', 'pepcid-ac-zantac-360-famotidine-341989', 'effexor-xr-venbysi-xr-venlafaxine-342963', 'advair-diskus-salmeterol-fluticasone-inhaled-343448', 'oxycontin-xtampza-er-oxycodone-343321']

        base_url = "https://reference.medscape.com/drug/"

        meds = []

        for drug in drug_endpoints:
            url = f'{base_url}{drug}'

            html = requests.get(url)

            doc = BeautifulSoup(html.text, 'html.parser')

            generic_name = doc.select('.drug_section_link')[0].find(string=True, recursive=False)

            brand_name = doc.select('.drugbrandname')[0].find(string=True, recursive=False)
            other_brands = doc.select('#drugbrandname_more')
            if other_brands:
                brand_names = brand_name + other_brands[0].get_text(strip=True)
            else:
                brand_names=brand_name

            drug_class = doc.select('.drug-classes')[0].find_next_sibling('a').get_text(strip=True)

            dose_adult = doc.select('#dose_adult')[0]
            dosages = dose_adult.find_next('h3').find_next_siblings()
            dosage_list = []
            for element in dosages:
                if element.name == 'h4':
                    dosage_list.append(f'{element.get_text(strip=True)}: ')
                elif element.name == 'ul':
                    for li in element.find_all('li'):
                        dosage_list.append(li.get_text(strip=True))

            dosages = ""
            for i, text in enumerate(dosage_list):
                if i == len(dosage_list) - 1 or not text.endswith(": "):
                    dosages += text + ". "
                else:
                    dosages += text

            use_elements = dose_adult.find('div').find_next_siblings('h3')
            uses = []
            for element in use_elements:
                if element.get_text(strip=True) == 'Dosage Modifications' or element.get_text(strip=True) == 'Dosing Considerations':
                    break
                uses.append(element.get_text(strip=True))
            uses = ", ".join(uses)

            adverse_effects = doc.select('#content_4')[0].find('h2', string='Adverse Effects').find_next_sibling('div')
            adverse_effects_list = []

            for element in adverse_effects.contents:
                if element.name == 'p':
                    adverse_effects_list.append(element.get_text(strip=True))
                elif element.name == 'ul':
                    for li in element.find_all('li'):
                        adverse_effects_list.append(li.get_text(strip=True))


            adverse_effects = ". ".join(adverse_effects_list)

            bb_warning = doc.select('.bbinfo')

            if bb_warning:
                bb_warning_text = []
                bb_warning_elements = bb_warning[0].find('h3').find_next_siblings()
                for element in bb_warning_elements:
                    if element.name == 'p':
                            bb_warning_text.append(element.get_text(strip=True))
                    elif element.name == 'h4':
                        bb_warning_text.append(f'{element.get_text(strip=True)}: ')
                    elif element.name == 'ul':
                        for li in element.find_all('li'):
                            bb_warning_text.append(li.get_text(strip=True))
                bb_warning = ''
                for i, text in enumerate(bb_warning_text):
                        if i == len(bb_warning_text) - 1 or not text.endswith(": "):
                            bb_warning += text + ". "
                        else:
                            bb_warning += text
            else:
                bb_warning = None

            cc_ps= doc.select('#content_5')[0].find('h3', string='Contraindications').find_next_siblings('p')
            contraindications_cautions = ". ".join(paragraph.get_text(strip=True) for paragraph in cc_ps)

            admin_div = doc.select('#content_11')
            admin_slip_list = ['atenolol', 'furosemide', 'potassium chloride', 'warfarin', 'famotidine']
            if admin_div:
                admin_div = admin_div[0].find('h2', string='Administration').find_next_sibling('div')
                if generic_name in admin_slip_list:
                    admin = None
                else:
                    if generic_name == 'atorvastatin' :
                        admin_elements = admin_div.find_next('h3', string='Oral Administration ').find_next_siblings()
                    elif generic_name == 'escitalopram':
                        admin_elements = admin_div.find_next('h3', string='Oral Administrationº').find_next_siblings()
                    elif generic_name == 'fluticasone inhaled':
                        admin_elements = admin_div.find_next('h3', string='Orally Inhaled Administration').find_next_siblings()
                    elif generic_name == 'insulin glargine' or generic_name == 'insulin regular human':
                        admin_elements = admin_div.find_next('h3', string='SC Administration').find_next_siblings()
                    elif generic_name == 'salmeterol/fluticasone inhaled':
                        admin_elements = admin_div.find_next('h3', string='Inhaler Oral Inhalation Administration').find_next_siblings()
                    elif generic_name == 'oxycodone':
                        admin_elements = admin_div.find_next('h3', string='Oral Administration, Controlled-release').find_next_siblings()
                    else:
                        admin_elements = admin_div.find_next('h3', string='Oral Administration').find_next_siblings()
                    
                    admin_list = []

                    for element in admin_elements:
                        if element.name == 'h3' and element.get_text(strip=True) == 'Storage':
                            break
                        if element.name == 'p':
                            admin_list.append(element.get_text(strip=True))
                        elif element.name == 'h4':
                            admin_list.append(f'{element.get_text(strip=True)}: ')
                        elif element.name == 'ul':
                            for li in element.find_all('li'):
                                admin_list.append(li.get_text(strip=True))
                    
                    admin = ""
                    for i, text in enumerate(admin_list):
                        if i == len(admin_list) - 1 or not text.endswith(": "):
                            admin += text + ". "
                        else:
                            admin += text
            else:
                admin = None

            new_med = Medication()
            new_med.generic_name = generic_name
            new_med.brand_names = brand_names
            new_med.drug_class = drug_class
            new_med.box_warning = bb_warning
            new_med.indications = uses
            new_med.dosages = dosages
            new_med.contraindications_and_cautions = contraindications_cautions
            new_med.adverse_effects = adverse_effects
            new_med.administration = admin
            print(generic_name)
            meds.append(new_med)

        db.session.add_all(meds)
        db.session.commit()