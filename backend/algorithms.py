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

def estimate_gpa_percentile(minimum, mean, gpa):
    if gpa < minimum:
        return 0
    elif gpa < mean:
        step = (mean-minimum)/50
        return int((gpa-minimum)/step)
    else:
        step = (4.0-mean)/50
        return int(50+(gpa-mean)/step)

def detect_questionable_acceptance(college, student):
    SAT_MIN = 200
    SAT_MAX = 800
    ACT_MIN = 2
    ACT_MAX = 36
    
    grades = student.grades
    
    # Estimate percentile for SAT Math
    sat_math_percentile = None
    if 'sat_math' in grades and grades["sat_math"] not in {None, ""}:
        student_sat_math = grades["sat_math"]
        sat_math_25 = college.sat_math_25
        sat_math_75 = college.sat_math_75
        if sat_math_25 and sat_math_75:
            sat_math_percentile = estimate_exam_percentile(SAT_MIN, sat_math_25, sat_math_75, SAT_MAX, student_sat_math)
            if sat_math_percentile < 1: # Mark as questionable if below 1st percentile
                return 0
    
    # Estimate percentile for SAT EBRW
    sat_ebrw_percentile = None
    if 'sat_ebrw' in grades and grades["sat_ebrw"] not in {None, ""}:
        student_sat_ebrw = grades["sat_ebrw"]
        sat_ebrw_25 = college.sat_ebrw_25
        sat_ebrw_75 = college.sat_ebrw_75
        if sat_ebrw_25 and sat_ebrw_75:
            sat_ebrw_percentile = estimate_exam_percentile(SAT_MIN, sat_ebrw_25, sat_ebrw_75, SAT_MAX, student_ebrw_math)
            if sat_ebrw_percentile < 1: # Mark as questionable if below 1st percentile
                return 0
    
    # Estimate percentile for ACT Composite
    act_percentile = None
    if 'act_composite' in grades and grades["act_composite"] not in {None, ""}:
        student_act = grades["act_composite"]
        act_composite_25 = college.act_composite_25
        act_composite_75 = college.act_composite_75
        if act_composite_25 and act_composite_75:
            act_percentile = estimate_exam_percentile(ACT_MIN, act_composite_25, act_composite_75, ACT_MAX, student_act)
            if act_percentile < 1: # Mark as questionable if below 1st percentile
                return 0
    
    # Estimate percentile for GPA
    gpa_percentile = None
    student_gpa = student.gpa
    if student_gpa != None:
        avg_gpa = college.avg_gpa
        if avg_gpa != None:
            gpa_percentile = estimate_gpa_percentile(avg_gpa*0.8, avg_gpa, student_gpa)
    
    # Calculate final score
    score = 0
    denominator = 0
    if sat_math_percentile:
        score += sat_math_percentile*0.2
        denominator += 0.2
    if sat_ebrw_percentile:
        score += sat_ebrw_percentile*0.2
        denominator += 0.2
    if act_percentile:
        score += act_percentile*0.4
        denominator += 0.4
    if gpa_percentile:
        score += gpa_percentile*0.2
        denominator += 0.2
    if denominator != 0:
        return score/denominator
    return -1

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
    score = 0
    denominator = 0
    if acceptance_likelihood >= 0:
        score += acceptance_likelihood*0.4
        denominator += 0.4
    if academic_similarity >= 0:
        score += academic_similarity*0.4
        denominator += 0.4
    if non_academic_suitability > 0:
        score += non_academic_suitability*0.2
    if denominator != 0:
        return score/denominator
    return 0
