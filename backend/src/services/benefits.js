const ALL_BENEFITS = [
  { id: 'ss-retirement', name: 'Social Security — Retirement', description: 'Monthly retirement benefits from Social Security based on your work history and age (generally 62+). Apply: https://www.ssa.gov/retirement' },
  { id: 'ssdi', name: 'Social Security Disability Insurance (SSDI)', description: 'Monthly benefits for workers with sufficient work history who have a qualifying disability that limits ability to work. Apply: https://www.ssa.gov/applyfordisability/' },
  { id: 'ssi', name: 'Supplemental Security Income (SSI)', description: 'Needs-based cash assistance for people with low income/resources who are aged 65+, blind, or disabled. Apply: https://www.ssa.gov/apply/ssi' },
  { id: 'medicare', name: 'Medicare', description: 'Federal health insurance for people 65+ or with certain disabilities (Parts A/B/C/D). Sign-up guidance: https://www.medicare.gov/basics/get-started-with-medicare/sign-up' },
  { id: 'medicaid', name: 'Medicaid (KanCare)', description: 'Health coverage for low-income individuals/families. How to apply / state contacts: https://www.medicaid.gov/ (choose your state). For Kansas see KanCare links below.' },
  { id: 'chip', name: 'CHIP', description: 'Low-cost health coverage for children in families that earn too much for Medicaid. State links: https://www.medicaid.gov/chip' },
  { id: 'snap', name: 'SNAP (Food Assistance)', description: 'Monthly benefits to help buy food for eligible low-income households. How to apply: https://www.fns.usda.gov/snap/supplemental-nutrition-assistance-program' },
  { id: 'wic', name: 'WIC', description: 'Nutrition support for pregnant/postpartum people, infants, and children under 5. Apply / find local office: https://www.fns.usda.gov/wic/applicant-participant/apply' },
  { id: 'tanf', name: 'TANF (Successful Families)', description: 'Temporary cash assistance and work support for families with dependent children and very low income. Program info: https://acf.gov/ofa/programs/temporary-assistance-needy-families-tanf' },
  { id: 'ui', name: 'Unemployment Insurance', description: 'Temporary income support for eligible workers who lost their job. Overview & state links: https://www.usa.gov/unemployment-benefits' },
  { id: 'section8', name: 'Housing Choice Vouchers (Section 8)', description: 'Rental assistance vouchers to help eligible households afford housing. How to apply / local PHA info: https://www.hud.gov/helping-americans/housing-choice-vouchers-tenants' },
  { id: 'public-housing', name: 'Public Housing (HUD)', description: 'Affordable housing units owned by local housing agencies. PHA contacts: https://www.hud.gov/contactus/public-housing-contacts' },
  { id: 'liheap', name: 'Energy Assistance (LIEAP/LIHEAP)', description: 'Assistance with home energy bills for eligible low-income households. How to apply: https://www.acf.gov/ocs/programs/liheap' },
  { id: 'headstart', name: 'Head Start / Early Head Start', description: 'Early childhood education, health, and nutrition for low-income children (birth to age 5). How to apply / center locator: https://headstart.gov/how-apply' },
  { id: 'pell', name: 'Federal Pell Grant', description: 'Need-based grants to low-income undergraduate students. How to apply: https://studentaid.gov/understand-aid/types/grants/pell' },
  { id: 'federal-student-aid', name: 'Federal Student Aid (FAFSA-based)', description: 'Loans, grants, and work-study determined by FAFSA information. Start FAFSA: https://studentaid.gov/h/apply-for-aid/fafsa' },
  { id: 'eitc', name: 'Earned Income Tax Credit (EITC)', description: 'Refundable tax credit for low-to-moderate income workers. How to claim: https://www.irs.gov/credits-deductions/individuals/earned-income-tax-credit/how-to-claim-the-earned-income-tax-credit-eitc' },
  { id: 'ctc', name: 'Child Tax Credit (CTC)', description: 'Tax credit for qualifying children under age thresholds with income limits. IRS info: https://www.irs.gov/credits-deductions/individuals/child-tax-credit' },
  { id: 'va-benefits', name: 'Veterans Benefits (VA)', description: 'VA disability compensation, pension, health care, education benefits. Apply/manage: https://www.va.gov/' },
  { id: 'fema-ihp', name: 'FEMA Disaster Assistance (IHP)', description: 'Assistance for individuals and households after declared disasters. Apply: https://www.disasterassistance.gov/' },
  { id: 'lifeline', name: 'Lifeline (Phone/Internet)', description: 'Discounts on phone/internet for eligible low-income subscribers. Get started / National Verifier: https://www.lifelinesupport.org/get-started/' },
  { id: 'ccdf', name: 'Child Care Subsidies (CCDF)', description: 'Helps low-income families pay for child care. Info & state application links: https://childcare.gov/consumer-education/get-help-paying-for-child-care' },
  { id: 'school-meals', name: 'School Meal Programs', description: 'Free or reduced-price school meals for eligible children. Apply guidance: https://www.fns.usda.gov/school-meals/apply-free-and-reduced-price-school-meals' },
  { id: 'wap', name: 'Weatherization Assistance Program (WAP)', description: 'Energy efficiency improvements for eligible households. How to apply / state contacts: https://www.energy.gov/scep/wap/how-apply-weatherization-assistance' },
  { id: 'student-loan-programs', name: 'Student Loan Repayment/Forgiveness (IDR/PSLF)', description: 'Income-driven repayment and loan forgiveness. PSLF: https://studentaid.gov/pslf and Forgiveness: https://studentaid.gov/manage-loans/forgiveness-cancellation' },
  { id: 'kancare', name: 'KanCare (KS Medicaid)', description: 'Kansas Medicaid coverage for eligible low-income individuals/families. Apply: https://www.kancare.ks.gov/apply-now' },
  { id: 'ks-chip', name: 'Kansas CHIP', description: 'Kansas health coverage for children above Medicaid income limits. Apply via KanCare: https://www.kancare.ks.gov/apply-now and eligibility: https://www.kancare.ks.gov/eligibility' },
  { id: 'ks-snap', name: 'Kansas SNAP (Food Assistance)', description: 'Kansas Food Assistance. Apply via DCF: https://www.dcf.ks.gov/services/ees/pages/food/foodassistance.aspx' },
  { id: 'ks-tanf', name: 'Successful Families (KS TANF)', description: 'KS cash assistance and work support for families with children. Info / apply: https://www.dcf.ks.gov/services/ees/Pages/Cash/TANF.aspx' },
  { id: 'ks-ui', name: 'Kansas Unemployment Insurance', description: 'State unemployment benefits for eligible workers. File a claim: https://www.dol.ks.gov/unemployment (portal: https://kansasui.gov )' },
  { id: 'ks-child-care', name: 'Kansas Child Care Assistance', description: 'Helps pay for child care for eligible KS families. Apply: https://www.dcf.ks.gov/services/ees/Pages/Child_Care/ChildCareSubsidy.aspx' },
  { id: 'ks-wic', name: 'Kansas WIC', description: 'Kansas WIC nutrition program. Pre-application & local agency: https://www.kdhe.ks.gov/1000/Nutrition-WIC-Services' },
  { id: 'ks-lieap', name: 'Kansas LIEAP (Energy Assistance)', description: 'Kansas Low Income Energy Assistance Program. Apply: https://www.dcf.ks.gov/services/ees/Pages/EnergyAssistance.aspx' },
  { id: 'ks-wap', name: 'Kansas Weatherization (KHRC WAP)', description: 'Kansas weatherization assistance. Apply / find local WAP: https://kshousingcorp.org/category/programs/weatherization/' },
  { id: 'ks-housing-programs', name: 'Kansas Housing Programs (KHRC/LIHTC)', description: 'KHRC housing programs and resources. Start here: https://kshousingcorp.org/' },
  { id: 'ks-section8', name: 'Kansas Section 8 (Local PHAs)', description: 'Find local KS PHA and apply for vouchers: https://www.hud.gov/contactus/public-housing-contacts' },
  { id: 'ks-csfp', name: 'Kansas CSFP & Commodity Programs', description: 'Commodity Supplemental Food Program for seniors (60+). Apply / county contacts: https://www.dcf.ks.gov/services/ees/Pages/USDA-Commodity-Programs/CSFP/CSFP.aspx' },
  { id: 'ks-snap-elderly-disabled', name: 'KS SNAP (Elderly/Disabled Rules)', description: 'SNAP special rules for elderly/disabled households in Kansas. Guidance / apply: https://www.dcf.ks.gov/services/ees/pages/food/foodassistance.aspx' },
  { id: 'ks-senior-disability', name: 'Kansas Senior & Disability Services', description: 'KDADS Aging & Disability Services (in-home supports, meals). Info: https://www.kdads.ks.gov/' },
  { id: 'ks-school-meals', name: 'Kansas Free & Reduced School Meals / SUN Bucks', description: 'KSDE school meals. Apply via KSDE portal: https://schoolmealsapp.ksde.org/' },
  { id: 'ks-veteran-services', name: 'Kansas Veteran Services', description: 'State veteran service resources and assistance. Start: https://www.kovs.ks.gov/ or https://kdva.ks.gov/' },
  { id: 'ks-child-support', name: 'Kansas Child Support & Child Welfare (DCF)', description: 'Apply for child support services. Online portal: https://cssapply.dcf.ks.gov/' },
  { id: 'ks-emergency-disaster', name: 'Kansas Emergency & Disaster Assistance', description: 'Kansas Division of Emergency Management resources. Info: https://www.kansastag.gov/101/KDEM' },
  { id: 'ks-lihtc', name: 'Kansas LIHTC / Affordable Units', description: 'KHRC LIHTC / affordable housing programs. Info: https://kshousingcorp.org/housing-partners/housing-development-lihtc/' },
  { id: 'ks-local-weatherization', name: 'Kansas Local Weatherization/Energy Programs', description: 'KHRC weatherization / energy-saving program info: https://kshousingcorp.org/category/programs/weatherization/' }
]

function getAnswer(answers, id) { return answers?.[id] || '' }
function hasYes(answers, id) { return String(getAnswer(answers, id)).toLowerCase() === 'yes' }
function isAgeAtLeast(answers, threshold) {
  const age = String(getAnswer(answers, 1))
  const map = { 'Under 18': 17,'18-24': 20,'25-34': 30,'35-44': 40,'45-54': 50,'55-64': 60,'65+': 70 }
  const approx = map[age] ?? 0
  return approx >= threshold
}
function citizenshipEligible(answers) { return hasYes(answers, 5) }
function hasSSN(answers) { return hasYes(answers, 7) }
function employmentStatus(answers) { return String(getAnswer(answers, 22)) }
function primaryIncome(answers) { return String(getAnswer(answers, 21)) }
function disabilityLimitsWork(answers) { return hasYes(answers, 48) }
function over65OrDisabled(answers) { return isAgeAtLeast(answers, 65) || disabilityLimitsWork(answers) || hasYes(answers, 45) }
function householdSize(answers) { const n = parseInt(String(getAnswer(answers, 10)), 10); return isNaN(n) ? 1 : n }
function incomeAnnualBucket(answers) { return String(getAnswer(answers, 20)) }
function incomeAnnualMaxApprox(answers) {
  const bucket = incomeAnnualBucket(answers)
  if (!bucket) return null
  const map = { '<$12,000':12000,'$12,000 - $24,999':24999,'$25,000 - $39,999':39999,'$40,000 - $59,999':59999,'$60,000 - $79,999':79999,'$80,000 - $99,999':99999,'$100,000+':200000 }
  return map[bucket] ?? null
}
function assetsApprox(answers) {
  const map = { '<$250':250,'$250 - $999':999,'$1,000 - $2,499':2499,'$2,500 - $4,999':4999,'$5,000 - $9,999':9999,'$10,000 - $24,999':24999,'$25,000+':50000,'Not applicable':0 }
  return map[String(getAnswer(answers, 29))] ?? 0
}
function hasChildren(answers) { return (parseInt(String(getAnswer(answers, 11)) || '0', 10) || 0) > 0 }
function hasChildUnder5(answers) { return (parseInt(String(getAnswer(answers, 12)) || '0', 10) || 0) > 0 }
function isPregnant(answers) { return hasYes(answers, 15) }
function kansasResident(answers) { return hasYes(answers, 6) }
function paysUtilitiesOrHousing(answers) { return (String(getAnswer(answers, 31)).toLowerCase() === 'yes') || (String(getAnswer(answers, 36)).toLowerCase() === 'yes') }
function medicaidIncomeLimit(size) { const base = 15000; const per = 5200; return base + (size - 1) * per }
function chipUpperLimit(size) { return medicaidIncomeLimit(size) * 1.5 }
function snapIncomeLimit(size) { return medicaidIncomeLimit(size) }
function liheapIncomeLimit(size) { return medicaidIncomeLimit(size) * 1.6 }
function tanfIncomeLimit(size) { return medicaidIncomeLimit(size) * 0.7 }

function computeBenefits(answers) {
  const out = []
  const size = householdSize(answers)
  const annualMax = incomeAnnualMaxApprox(answers)
  const assets = assetsApprox(answers)
  const citizen = citizenshipEligible(answers)
  const ssn = hasSSN(answers)
  const hasKids = hasChildren(answers)
  const childU5 = hasChildUnder5(answers)
  const preg = isPregnant(answers)
  const ks = kansasResident(answers)
  if (isAgeAtLeast(answers, 62) && ssn && citizen && ['Job','Self-employment'].includes(primaryIncome(answers))) { out.push({ id: 'ss-retirement', name: 'Social Security — Retirement', reason: 'Meets age, SSN, work history, and status', description: ALL_BENEFITS.find(b=>b.id==='ss-retirement')?.description }) }
  if (disabilityLimitsWork(answers) && ssn && citizen && ['Job','Self-employment'].includes(primaryIncome(answers))) { out.push({ id: 'ssdi', name: 'Social Security Disability Insurance (SSDI)', reason: 'Disability limiting work + SSN + prior work', description: ALL_BENEFITS.find(b=>b.id==='ssdi')?.description }) }
  if ((isAgeAtLeast(answers,65) || disabilityLimitsWork(answers) || (parseInt(String(getAnswer(answers,13))||'0',10)||0) > 0) && (annualMax !== null && annualMax <= 20000) && assets <= 2500 && ssn && citizen) { out.push({ id: 'ssi', name: 'Supplemental Security Income (SSI)', reason: 'Age/disability + low income/resources + SSN', description: ALL_BENEFITS.find(b=>b.id==='ssi')?.description }) }
  if (over65OrDisabled(answers) && ssn && citizen) { out.push({ id: 'medicare', name: 'Medicare', reason: 'Age 65+ or disability with SSN', description: ALL_BENEFITS.find(b=>b.id==='medicare')?.description }) }
  if ((annualMax !== null && annualMax <= medicaidIncomeLimit(size)) && (preg || hasKids || childU5 || disabilityLimitsWork(answers) || (parseInt(String(getAnswer(answers,13))||'0',10)||0) > 0 || String(getAnswer(answers,14)).toLowerCase()==='yes') && citizen && ks) { out.push({ id: 'medicaid', name: 'Medicaid (KanCare)', reason: 'Low income + covered category + KS resident', description: ALL_BENEFITS.find(b=>b.id==='medicaid')?.description }) }
  if (hasKids && (annualMax !== null && annualMax > medicaidIncomeLimit(size) && annualMax <= chipUpperLimit(size)) && citizen && ks) { out.push({ id: 'chip', name: 'CHIP', reason: 'Child in household + moderate income + KS resident', description: ALL_BENEFITS.find(b=>b.id==='chip')?.description }) }
  if ((annualMax !== null && annualMax <= snapIncomeLimit(size)) && assets <= 5000 && citizen && ks) { out.push({ id: 'snap', name: 'SNAP (Food Assistance)', reason: 'Low income/resources + KS resident', description: ALL_BENEFITS.find(b=>b.id==='snap')?.description }) }
  if ((preg || childU5 || hasYes(answers,71)) && ((annualMax !== null && annualMax <= medicaidIncomeLimit(size) * 1.85) || hasYes(answers,39) || hasYes(answers,44)) && ks) { out.push({ id: 'wic', name: 'WIC', reason: 'Pregnant/child <5 or postpartum + income/program participation + KS resident', description: ALL_BENEFITS.find(b=>b.id==='wic')?.description }) }
  if (hasKids && (annualMax !== null && annualMax <= tanfIncomeLimit(size)) && citizen && ks) { out.push({ id: 'tanf', name: 'TANF (Successful Families)', reason: 'Dependent child + very low income + KS resident', description: ALL_BENEFITS.find(b=>b.id==='tanf')?.description }) }
  if (employmentStatus(answers) === 'Unemployed' && (hasYes(answers,24) || ['Job','Self-employment'].includes(primaryIncome(answers))) && ssn && citizen) { out.push({ id: 'ui', name: 'Unemployment Insurance', reason: 'Unemployed with prior wages/benefits + SSN', description: ALL_BENEFITS.find(b=>b.id==='ui')?.description }) }
  if ((annualMax !== null && annualMax <= snapIncomeLimit(size)) && (String(getAnswer(answers,30)).toLowerCase() !== '') && citizen && ssn) { out.push({ id: 'section8', name: 'Housing Choice Vouchers (Section 8)', reason: 'Low income + housing need', description: ALL_BENEFITS.find(b=>b.id==='section8')?.description }) }
  if (((annualMax !== null) && annualMax <= liheapIncomeLimit(size)) && paysUtilitiesOrHousing(answers) && ks) { out.push({ id: 'liheap', name: 'Energy Assistance (LIEAP/LIHEAP)', reason: 'Income within limits + pays utilities', description: ALL_BENEFITS.find(b=>b.id==='liheap')?.description }) }
  if ((annualMax !== null && annualMax <= snapIncomeLimit(size)) && ssn && citizen && (String(getAnswer(answers,30)).toLowerCase() !== '') && String(getAnswer(answers,8)).toLowerCase() !== 'yes') { out.push({ id: 'public-housing', name: 'Public Housing (HUD)', reason: 'Low income + housing need + not incarcerated', description: ALL_BENEFITS.find(b=>b.id==='public-housing')?.description }) }
  if ((hasKids || childU5) && ((annualMax !== null && annualMax <= medicaidIncomeLimit(size)) || hasYes(answers,68) || disabilityLimitsWork(answers)) && ks) { out.push({ id: 'headstart', name: 'Head Start / Early Head Start', reason: 'Young child + low income/need + local residency', description: ALL_BENEFITS.find(b=>b.id==='headstart')?.description }) }
  if (hasYes(answers,52) && String(getAnswer(answers,55)).toLowerCase() !== '' && ssn && citizen) { out.push({ id: 'pell', name: 'Federal Pell Grant', reason: 'Student seeking aid with low/moderate income', description: ALL_BENEFITS.find(b=>b.id==='pell')?.description }) }
  if (hasYes(answers,52) && String(getAnswer(answers,55)).toLowerCase() !== '' && ssn && citizen) { out.push({ id: 'federal-student-aid', name: 'Federal Student Aid (FAFSA-based)', reason: 'Student with FAFSA-based need/eligibility', description: ALL_BENEFITS.find(b=>b.id==='federal-student-aid')?.description }) }
  if ((['Job','Self-employment'].includes(primaryIncome(answers))) && (annualMax !== null && annualMax <= 70000) && hasYes(answers,57) && ssn && citizen) { out.push({ id: 'eitc', name: 'Earned Income Tax Credit (EITC)', reason: 'Earned income + tax filer within income limits', description: ALL_BENEFITS.find(b=>b.id==='eitc')?.description }) }
  if (hasKids && hasYes(answers,57) && ssn && citizen && (annualMax !== null && annualMax <= 200000)) { out.push({ id: 'ctc', name: 'Child Tax Credit (CTC)', reason: 'Child(ren) + tax filer within income thresholds', description: ALL_BENEFITS.find(b=>b.id==='ctc')?.description }) }
  if (hasYes(answers,62) && ssn && citizen) { out.push({ id: 'va-benefits', name: 'Veterans Benefits (VA)', reason: 'Veteran status; disability/income rules may apply', description: ALL_BENEFITS.find(b=>b.id==='va-benefits')?.description }) }
  if (hasYes(answers,68) && ssn && citizen) { out.push({ id: 'fema-ihp', name: 'FEMA Disaster Assistance (IHP)', reason: 'Disaster impact + eligible status', description: ALL_BENEFITS.find(b=>b.id==='fema-ihp')?.description }) }
  if ((hasYes(answers,39) || hasYes(answers,44) || String(getAnswer(answers,49)).toLowerCase() === 'yes' || (annualMax !== null && annualMax <= medicaidIncomeLimit(size))) && ssn && citizen) { out.push({ id: 'lifeline', name: 'Lifeline (Phone/Internet)', reason: 'Participation in qualifying program or income-based', description: ALL_BENEFITS.find(b=>b.id==='lifeline')?.description }) }
  if (hasKids && (String(getAnswer(answers,22)) !== 'Unemployed' || String(getAnswer(answers,51)) !== '') && (annualMax !== null && annualMax <= chipUpperLimit(size)) && ks && String(getAnswer(answers,31)).toLowerCase() === 'yes') { out.push({ id: 'ccdf', name: 'Child Care Subsidies (CCDF)', reason: 'Child care need + work/training + income limits', description: ALL_BENEFITS.find(b=>b.id==='ccdf')?.description }) }
  if (hasKids && ((annualMax !== null && annualMax <= medicaidIncomeLimit(size)*1.85) || hasYes(answers,39))) { out.push({ id: 'school-meals', name: 'School Meal Programs', reason: 'Child in school + income or SNAP', description: ALL_BENEFITS.find(b=>b.id==='school-meals')?.description }) }
  if (((annualMax !== null && annualMax <= liheapIncomeLimit(size)) || hasYes(answers,44) || hasYes(answers,39)) ) { out.push({ id: 'wap', name: 'Weatherization Assistance Program (WAP)', reason: 'Low income or participation in qualifying programs', description: ALL_BENEFITS.find(b=>b.id==='wap')?.description }) }
  if (String(getAnswer(answers,54)).toLowerCase() === 'yes') { out.push({ id: 'student-loan-programs', name: 'Student Loan Repayment/Forgiveness (IDR/PSLF)', reason: 'Has federal student loans; may qualify based on income/employment', description: ALL_BENEFITS.find(b=>b.id==='student-loan-programs')?.description }) }
  if (ks && (annualMax !== null && annualMax <= medicaidIncomeLimit(size)) && (preg || hasKids || disabilityLimitsWork(answers) || (parseInt(String(getAnswer(answers,13))||'0',10)||0) > 0 || String(getAnswer(answers,14)).toLowerCase()==='yes') && citizen && ssn) { out.push({ id: 'kancare', name: 'KanCare (KS Medicaid)', reason: 'KS resident + low income + covered category', description: ALL_BENEFITS.find(b=>b.id==='kancare')?.description }) }
  if (ks && hasKids && (annualMax !== null && annualMax > medicaidIncomeLimit(size) && annualMax <= chipUpperLimit(size)) && citizen) { out.push({ id: 'ks-chip', name: 'Kansas CHIP', reason: 'KS child coverage above Medicaid up to CHIP', description: ALL_BENEFITS.find(b=>b.id==='ks-chip')?.description }) }
  if (ks && (annualMax !== null && annualMax <= snapIncomeLimit(size)) && assets <= 5000 && citizen) { out.push({ id: 'ks-snap', name: 'Kansas SNAP (Food Assistance)', reason: 'KS SNAP income/resources within limits', description: ALL_BENEFITS.find(b=>b.id==='ks-snap')?.description }) }
  if (ks && hasKids && (annualMax !== null && annualMax <= tanfIncomeLimit(size)) && citizen) { out.push({ id: 'ks-tanf', name: 'Successful Families (KS TANF)', reason: 'KS resident + dependent child + very low income', description: ALL_BENEFITS.find(b=>b.id==='ks-tanf')?.description }) }
  if (ks && employmentStatus(answers) === 'Unemployed' && (hasYes(answers,24) || ['Job','Self-employment'].includes(primaryIncome(answers))) && ssn && citizen) { out.push({ id: 'ks-ui', name: 'Kansas Unemployment Insurance', reason: 'Unemployed with prior wages/benefits; KS resident', description: ALL_BENEFITS.find(b=>b.id==='ks-ui')?.description }) }
  if (ks && hasKids && (String(getAnswer(answers,22)) !== 'Unemployed' || String(getAnswer(answers,51)) !== '') && (annualMax !== null && annualMax <= chipUpperLimit(size)) && String(getAnswer(answers,31)).toLowerCase() === 'yes') { out.push({ id: 'ks-child-care', name: 'Kansas Child Care Assistance', reason: 'Work/training with child care need + income', description: ALL_BENEFITS.find(b=>b.id==='ks-child-care')?.description }) }
  if (ks && (preg || childU5 || hasYes(answers,71)) && ((annualMax !== null && annualMax <= medicaidIncomeLimit(size) * 1.85) || hasYes(answers,44) || hasYes(answers,39)) ) { out.push({ id: 'ks-wic', name: 'Kansas WIC', reason: 'KS resident + pregnant/young child + income/participation', description: ALL_BENEFITS.find(b=>b.id==='ks-wic')?.description }) }
  if (ks && (annualMax !== null && annualMax <= liheapIncomeLimit(size)) && paysUtilitiesOrHousing(answers)) { out.push({ id: 'ks-lieap', name: 'Kansas LIEAP (Energy Assistance)', reason: 'KS resident + responsible for utilities + income', description: ALL_BENEFITS.find(b=>b.id==='ks-lieap')?.description }) }
  if (ks && ((annualMax !== null && annualMax <= liheapIncomeLimit(size)) || hasYes(answers,44) || hasYes(answers,39)) ) { out.push({ id: 'ks-wap', name: 'Kansas Weatherization (KHRC WAP)', reason: 'KS resident + income/program participation', description: ALL_BENEFITS.find(b=>b.id==='ks-wap')?.description }) }
  if (ks && (annualMax !== null && annualMax <= snapIncomeLimit(size)) && ssn && (String(getAnswer(answers,30)).toLowerCase() !== '')) { out.push({ id: 'ks-housing-programs', name: 'Kansas Housing Programs (KHRC/LIHTC)', reason: 'KS resident + income within %AMI thresholds', description: ALL_BENEFITS.find(b=>b.id==='ks-housing-programs')?.description }) }
  if (ks && (annualMax !== null && annualMax <= snapIncomeLimit(size)) && ssn) { out.push({ id: 'ks-section8', name: 'Kansas Section 8 (Local PHAs)', reason: 'KS PHA voucher programs with income limits', description: ALL_BENEFITS.find(b=>b.id==='ks-section8')?.description }) }
  if (ks && ((parseInt(String(getAnswer(answers,13))||'0',10)||0) > 0) && ssn && (annualMax !== null && annualMax <= medicaidIncomeLimit(size))) { out.push({ id: 'ks-csfp', name: 'Kansas CSFP & Commodity Programs', reason: 'KS resident + age 60+ within program limits', description: ALL_BENEFITS.find(b=>b.id==='ks-csfp')?.description }) }
  if (ks && ( (parseInt(String(getAnswer(answers,13))||'0',10)||0) > 0 || disabilityLimitsWork(answers)) && citizen) { out.push({ id: 'ks-snap-elderly-disabled', name: 'KS SNAP (Elderly/Disabled Rules)', reason: 'KS SNAP special rules for elderly/disabled households', description: ALL_BENEFITS.find(b=>b.id==='ks-snap-elderly-disabled')?.description }) }
  if (ks && ( (parseInt(String(getAnswer(answers,13))||'0',10)||0) > 0 || disabilityLimitsWork(answers) ) ) { out.push({ id: 'ks-senior-disability', name: 'Kansas Senior & Disability Services', reason: 'KS resident; senior/disability services may apply', description: ALL_BENEFITS.find(b=>b.id==='ks-senior-disability')?.description }) }
  if (ks && hasKids && ((annualMax !== null && annualMax <= medicaidIncomeLimit(size)*1.85) || hasYes(answers,39)) ) { out.push({ id: 'ks-school-meals', name: 'Kansas Free & Reduced School Meals / SUN Bucks', reason: 'KS child + income thresholds or SNAP', description: ALL_BENEFITS.find(b=>b.id==='ks-school-meals')?.description }) }
  if (ks && hasYes(answers,62) && ssn && citizen) { out.push({ id: 'ks-veteran-services', name: 'Kansas Veteran Services', reason: 'KS resident veteran; state supports available', description: ALL_BENEFITS.find(b=>b.id==='ks-veteran-services')?.description }) }
  if (ks && (hasKids || hasYes(answers,68)) ) { out.push({ id: 'ks-child-support', name: 'Kansas Child Support & Child Welfare (DCF)', reason: 'KS resident with children/welfare needs', description: ALL_BENEFITS.find(b=>b.id==='ks-child-support')?.description }) }
  if (ks && hasYes(answers,68)) { out.push({ id: 'ks-emergency-disaster', name: 'Kansas Emergency & Disaster Assistance', reason: 'KS resident impacted by disaster', description: ALL_BENEFITS.find(b=>b.id==='ks-emergency-disaster')?.description }) }
  if (ks && (annualMax !== null && annualMax <= snapIncomeLimit(size)) && ssn) { out.push({ id: 'ks-lihtc', name: 'Kansas LIHTC / Affordable Units', reason: 'KS resident with income in LIHTC ranges', description: ALL_BENEFITS.find(b=>b.id==='ks-lihtc')?.description }) }
  if ((ks || String(getAnswer(answers,4)) !== '') && ((annualMax !== null && annualMax <= liheapIncomeLimit(size)) || hasYes(answers,44) || hasYes(answers,39))) { out.push({ id: 'ks-local-weatherization', name: 'Kansas Local Weatherization/Energy Programs', reason: 'Residency + income/program participation', description: ALL_BENEFITS.find(b=>b.id==='ks-local-weatherization')?.description }) }
  return out
}

module.exports = { ALL_BENEFITS, computeBenefits }
