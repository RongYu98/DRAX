def estimate_exam_percentile(minimum, first_quartile, third_quartile, maximum, score):
    if score <= first_quartile:
        step = (first_quartile-minimum)/25
        return int((score-minimum)/step)
    elif score <= third_quartile:
        step = (third_quartile-first_quartile)/50
        return int(25+(score-first_quartile)/step)
    else:
        step = (maximum-third_quartile)/25
        return int(75+(score-third_quartile)/step)

def detect_questionable_acceptance(college, student):
    SAT_MIN = 200
    SAT_MAX = 800
    ACT_MIN = 2
    ACT_MAX = 36
    
    # Estimate percentile for SAT Math
    sat_math_percentile = None
    student_sat_math = student.grades["sat_math"]
    if student_sat_math != None:
        sat_math_25 = college.sat_math_25
        sat_math_75 = college.sat_math_75
        if sat_math_25 and sat_math_75:
            sat_math_percentile = estimate_exam_percentile(SAT_MIN, sat_math_25, sat_math_75, SAT_MAX, student_sat_math)
            if sat_math_percentile < 1: # Mark as questionable if below 1st percentile
                return 0
    
    # Estimate percentile for SAT EBRW
    sat_ebrw_percentile = None
    student_sat_ebrw = student.grades["sat_ebrw"]
    if student_sat_ebrw != None:
        sat_ebrw_25 = college.sat_ebrw_25
        sat_ebrw_75 = college.sat_ebrw_75
        if sat_ebrw_25 and sat_ebrw_75:
            sat_ebrw_percentile = estimate_exam_percentile(SAT_MIN, sat_ebrw_25, sat_ebrw_75, SAT_MAX, student_ebrw_math)
            if sat_ebrw_percentile < 1: # Mark as questionable if below 1st percentile
                return 0
    
    # Estimate percentile for ACT Composite
    act_percentile = None
    student_act = student.grades["act"]
    if student_act != None:
        act_composite_25 = college.act_composite_25
        act_composite_75 = college.act_composite_75
        if act_composite_25 and act_composite_75:
            act_percentile = estimate_exam_percentile(ACT_MIN, act_composite_25, act_composite_75, ACT_MAX, student_act)
            if act_percentile < 1: # Mark as questionable if below 1st percentile
                return 0
    
    # Estimate percentile for GPA
    student_gpa = student.gpa
    if student_gpa != None:
        avg_gpa = college.avg_gpa
        if avg_gpa and student_gpa < avg_gpa*0.8:
            return 0
    
    # Calculate final score
    if sat_math_percentile and sat_ebrw_percentile and sat_ebrw_percentile:
        score = sat_math_percentile*0.2 + sat_ebrw_percentile*0.2 + act_percentile*0.4 #+ gpa_percentile*0.2
    else:
        score = 0
    #print(score)
    return score

def compute_recommendation_score(college, student):
    # Calculate acceptance likelihood aspect
    acceptance_likelihood = detect_questionable_acceptance(college, student)
    
    # Calculate academic similarity aspect
    academic_similarity = 0
    
    # Calculate non-academic similarity aspect
    non_academic_factors = []
    debt = college.median_debt
    if debt != None:
        non_academic_factors.append(1-int(debt)/100000)
    if student.residence_state == college.state:
        cost = college.in_cost
    else:
        cost = college.out_cost
    if cost != None:
        non_academic_factors.append(1-int(cost)/40000)
    salary = college.salary
    if salary != None:
        non_academic_factors.append(int(salary)/50000)
    completion_rate = college.completion_rate
    if completion_rate != None:
        non_academic_factors.append(float(completion_rate))
    non_academic_suitability = 0
    if non_academic_factors != []:
        non_academic_suitability = max(1, sum(non_academic_factors)/len(non_academic_factors))*100
    
    # Calculate final score
    if non_academic_suitability > 0:
        score = acceptance_likelihood*0.4 + academic_similarity*0.4 + non_academic_suitability*0.2
    else:
        score = acceptance_likelihood*0.5 + academic_similarity*0.5
    return score

def compare_highschool(h1, h2):
    diff = (h1.reading_prof - h2.reading_prof)**2
    diff += (h1.math_prof - h2.math_prof)**2
    diff += (h1.grad_rate - h2.grad_rate)**2
    diff += (h1.ap_enroll - h2.ap_enroll)**2
    diff += ((h1.avg_sat - h2.avg_sat)*100/1600.)**2
    diff += ((h1.avg_act - h2.avg_act)*100/36)**2
    return diff
