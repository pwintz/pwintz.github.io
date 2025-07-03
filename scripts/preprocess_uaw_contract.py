#!/usr/bin/env python3
import os
import re
import argparse
# 
# def generate_list_replacement(enumerations, html_class, item_format, pattern_for_end_of_list):
# 
#   pattern_for_end_of_list = rf'\s*(?={pattern_for_end_of_list}|<ol|\Z)'
#   replacements = [
#     # Replace first
#     # (rf'(?:##)?\s+{enumerations[0]}\.\s',  
#     #   f'\n<ol class="{html_class}">\n<li class="{html_class}">'),
#     (rf'\s{enumerations[0]}\.\s(.*)(?=\s.*{enumerations[1]}\.\s)',  
#       f'\n<ol class="{html_class}">\n<li class="{html_class}">\\1</li>\n'),
#     # Replace middle
#     (rf'\s+[{enumerations[1]}-{enumerations[-1]}]\.\s(.*?)(?=\s[{enumerations[1]}-{enumerations[-1]}]\.\s)', f'\\1</li>\n<li class="{html_class}">'),
#     # Replace last 
#     (rf'((?:\s[{enumerations[0]}-{enumerations[-1]}]\.\s.*?)*)\s[{enumerations[1]}-{enumerations[-1]}]\.\s(.*?){pattern_for_end_of_list}',
#     f'\\1\\2</li>\n</ol>\n'
#     )]
#   return replacements


lowercase_roman_numerals = r'x{0,2}(?:i{1,3}|iv|vi{0,3}|ix|x)'
uppercase_roman_numerals = r'(?:I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII|XIV|XV)'

lower_roman_item = rf'(?:{lowercase_roman_numerals}\.|\({lowercase_roman_numerals}\))'
upper_roman_item = rf'{uppercase_roman_numerals}\.'
upper_alph_item  = r'[A-Z]\.'
lower_alph_item  = r'(?:[a-z]\.|[a-z]\))'
arabic_item      = r'(?:\d{1,2}\.|\d{1,2}\))'
any_item         = rf'(?:{lower_roman_item}|{upper_roman_item}|{lower_alph_item}|{upper_alph_item}|{arabic_item})'
non_line_break         = r'[^\n]'
end_of_file            = r'\Z'

not_start_of_file_lookbehind = '(?<!\A)'
markdown_header_prefix = rf'{not_start_of_file_lookbehind}^#+\s*'
# markdown_section_header       = rf'{not_start_of_file_lookbehind}^#[^#]'
# markdown_subsection_header    = rf'{not_start_of_file_lookbehind}^##[^#]'
# markdown_subsubsection_header = rf'{not_start_of_file_lookbehind}(?:^###[^#]|{markdown_header_prefix}({lower_alph_item}.*)'


# def generate_header_replacements

start_section_heading           = rf'{markdown_header_prefix}(?P<item_and_header>{upper_alph_item}{non_line_break}*)$'
start_subsection_heading        = rf'{markdown_header_prefix}(?P<item_and_header>{arabic_item}{non_line_break}*)$'
start_subsubsection_heading     = rf'{markdown_header_prefix}(?P<item_and_header>{lower_alph_item}{non_line_break}*)$'
start_section_nonheading        = rf'^(?P<item>{upper_alph_item})'
start_subsection_nonheading     = rf'^(?P<item>{arabic_item})'
start_subsubsection_nonheading  = rf'^(?P<item>{lower_alph_item})'
# start_subsection_from_space     = '^\ {2}' + rf'(?P<item>{any_item})'
# start_subsubsection_from_space  = '^\ {4}' + rf'(?P<item>{any_item})'
start_enumeration1               = '^\ {2}' + rf'(?P<item>{any_item})'
start_enumeration2               = '^\ {4}' + rf'(?P<item>{any_item})'
# start_enumeration3               = '^\ {6}' + rf'(?P<item>{any_item})'

end_of_section_lookahead_alternatives      = f'{start_section_heading}|{start_section_nonheading}'
end_of_subsection_lookahead_alternatives   = f'{start_subsection_heading}|{start_subsection_nonheading}|{end_of_section_lookahead_alternatives}'
end_of_subsubsection_lookahead_alternatives   = f'{start_subsubsection_heading}|{start_subsubsection_nonheading}|{end_of_subsection_lookahead_alternatives}'
end_of_enumeration1_lookahead_alternatives = f'{start_enumeration1}|{end_of_subsection_lookahead_alternatives}'
end_of_enumeration2_lookahead_alternatives = f'{start_enumeration2}|{end_of_enumeration1_lookahead_alternatives}'
# end_of_enumeration3_lookahead_alternatives = f'{start_enumeration3}|{end_of_enumeration2_lookahead_alternatives}'

end_of_section_lookahead         = rf'(?=<div class="lvl2">|{end_of_section_lookahead_alternatives}|{end_of_file})'
end_of_subsection_lookahead      = rf'(?=<div class="lvl[2-3]">|{end_of_subsection_lookahead_alternatives}|{end_of_file})'
end_of_subsubsection_lookahead   = rf'(?=<div class="lvl[2-4]">|{end_of_subsubsection_lookahead_alternatives}|{end_of_file})'
end_of_enumeration1_lookahead    = rf'(?=<div class="lvl[2-5]">|{end_of_enumeration1_lookahead_alternatives}|{end_of_file})'
end_of_enumeration2_lookahead    = rf'(?=<div class="lvl[2-6]">|{end_of_enumeration2_lookahead_alternatives}|{end_of_file})'
# end_of_enumeration3_lookahead    = rf'(?=<div class="lvl[2-7]">|{end_of_enumeration3_lookahead_alternatives}|{end_of_file})'

end_of_section_lookahead       = end_of_section_lookahead.replace('P<item_and_header>', ':').replace('P<item>', ':')
end_of_subsection_lookahead    = end_of_subsection_lookahead.replace('P<item_and_header>', ':').replace('P<item>', ':')
end_of_subsubsection_lookahead = end_of_subsubsection_lookahead.replace('P<item_and_header>', ':').replace('P<item>', ':')
end_of_enumeration1_lookahead  = end_of_enumeration1_lookahead.replace('P<item_and_header>', ':').replace('P<item>', ':')
end_of_enumeration2_lookahead  = end_of_enumeration2_lookahead.replace('P<item_and_header>', ':').replace('P<item>', ':')
# end_of_enumeration3_lookahead  = end_of_enumeration3_lookahead.replace('P<item_and_header>', ':').replace('P<item>', ':')

def header_replacement(lvl):
  return rf'<div class="lvl{lvl}"><h{lvl}>\g<item_and_header></h{lvl}>\g<body></div><!-- End of level {lvl}: \g<item_and_header>-->\n'
  # return rf'<div class="lvl{lvl}"><h{lvl}>\g<item_and_header></h{lvl}>\g<body></div><!-- End of level {lvl}: \g<item_and_header>-->\n'
def nonheader_replacement(lvl):
  return rf'<div class="lvl{lvl}"><h{lvl} class="inline-header">\g<item></h{lvl}>\g<body></div><!-- End of level {lvl}: \g<item>-->\n'
  # return rf'<div class="lvl{lvl}"><h{lvl} style="display: inline-block">\g<item></h{lvl}>\g<body></div><!-- End of level {lvl}: \g<item>-->\n'

print(rf'Section Non-Header Regex: (?s){start_section_nonheading}(?P<body>.+?){end_of_section_lookahead}')
print(rf'Section Header Regex: (?s){start_section_heading}(?P<body>.+?){end_of_section_lookahead}')
print(rf'start_section_heading Regex: {start_section_heading}')
print(rf'end_of_section_lookahead Regex: {end_of_section_lookahead}')
# exit(1)

# Define the list of (pattern, replacement) tuples for regex replacements
# When a line does not start with "#", then it is not a header
header_replacements = [
  # !! It is important to do the lower level groups first. Otherwise, the larger sections have "<div>" inserted 
  # !! at the start, which causes "{group_until_next_section}" to miss the start of the next section.
  
  # Sections
  (rf'(?s){start_section_nonheading}(?P<body>.+?){end_of_section_lookahead}', nonheader_replacement(2)),
  (rf'(?s){start_section_heading}(?P<body>.+?){end_of_section_lookahead}',    header_replacement(2)),
  # # # Subsections
  (rf'(?s){start_subsection_heading}(?P<body>.+?){end_of_subsection_lookahead}',  header_replacement(3)),
  (rf'(?s){start_subsection_nonheading}(?P<body>.+?){end_of_subsection_lookahead}', nonheader_replacement(3)),
  # # Subsubsections
  (rf'(?s){start_subsubsection_heading}(?P<body>.+?){end_of_subsubsection_lookahead}', header_replacement(4)),
  (rf'(?s){start_subsubsection_nonheading}(?P<body>.+?){end_of_subsubsection_lookahead}', nonheader_replacement(4)),
  # # Enumerations
  (rf'(?s){start_enumeration1}(?P<body>.+?){end_of_enumeration1_lookahead}', nonheader_replacement(5)),
  (rf'(?s){start_enumeration2}(?P<body>.+?){end_of_enumeration2_lookahead}', nonheader_replacement(6)),
  # (rf'(?s){start_enumeration3}(?P<body>.+?){end_of_enumeration3_lookahead}', nonheader_replacement(7)),

# 
#   # Any of the itemization types prefixed by four spaces will be rendered as level 5
#   (rf'(?s)^\ \ \ \ \ \ ({all_items}) {group_until_next_section}', f'<div class="lvl5"><h5 style="display: inline-block">\\1</h5> \\2</div>'),
#   # Any of the itemization types prefixed by four spaces will be rendered as level 4
#   (rf'(?s)^\ \ \ \ ({all_items}) {group_until_next_section}',     f'<div class="subsubsection"><h4 style="display: inline-block">\\1</h4> \\2</div>'),
#   (rf'(?s)^({lower_alph_item}) {group_until_next_section}',  f'<div class="subsubsection"><h3 style="display: inline-block">\\1</h3> \\2</div>'), # Level 3 - non-header
#   (rf'(?s){markdown_header_prefix}({lower_alph_item}.*){group_until_next_section}', f'<div class="subsubsection"><h3>\\1<\h3>\\2</div>'),# Level 3 header
#   # Any of the itemization types prefixed by two spaces will be rendered as level 3
#   (rf'(?s)^\ \ ({all_items}) {group_until_next_section}',    f'<div class="subsection"><h2 style="display: inline-block">\\1</h2> \\2</div>'),
#   (rf'(?s)^({arabic_item}) {group_until_next_section}',      f'<div class="subsection"><h2 style="display: inline-block">\\1</h2>\\2</div>'), # Level 2 - non-header
#   (rf'(?s){markdown_header_prefix}({arabic_item}.*){group_until_next_section}',     f'<div class="subsection"><h2>\\1<\h2>\\2</div>'), # Level 2 header
#   # When a line starts with "#" it will be made into a header
#   (rf'(?s)^({upper_alph_item}) {group_until_next_section}',  f'<div class="section"><h1 style="display: inline-block">\\1</h1> \\2</div>'), # Level 1 - non-header
#   (rf'(?s){markdown_header_prefix}({upper_alph_item}.*){group_until_next_section}', f'<div class="section"><h1>\\1<\h1></div>'),  # Level 1 header
]

def generate_contract_article_link_replacement(contract, number, name):
  return (rf'(?<!\S\"\>)(Article {number}(?: ?- ?|,? ){name}|Article {number})', f'<a href="/uaw/{contract}-2022-2025-contract/article-{number}">\\1</a>')

def generate_contract_appendix_link_replacement(contract, letter, pdf_name):
  if contract == 'ase':
    link = f'https://ucnet.universityofcalifornia.edu/wp-content/uploads/labor/bargaining-units/bx/docs/{pdf_name}.pdf'
  elif contract == 'gsr':
    link = f'https://qa.ucnet.universityofcalifornia.edu/wp-content/uploads/labor/bargaining-units/br/docs/{pdf_name}.pdf'
    print(f'link: {link}')
  return (rf'(?<!\S\"\>)(Appendix {letter.upper()})', f'<a href="{link}">\\1</a>')


# def generate_contract_appendix_link_replacement(number, name):
#   return (rf'(Appendix {number}\ -\ {name}|Article {number})', f'<a href="/uaw/gsr-2022-2025-contract/article-{number}">\\1</a>')

gsr_article_links_replacements = [
  generate_contract_article_link_replacement("gsr", 10, "Labor-Management Meetings"),
  generate_contract_article_link_replacement("gsr", 11, "Grievance and Arbitration"),
  generate_contract_article_link_replacement("gsr", 12, "TBD"),
  generate_contract_article_link_replacement("gsr", 13, "TBD"),
  generate_contract_article_link_replacement("gsr", 14, "TBD"),
  generate_contract_article_link_replacement("gsr", 15, "TBD"),
  generate_contract_article_link_replacement("gsr", 16, "TBD"),
  generate_contract_article_link_replacement("gsr", 17, "Leaves of Absence"),
  generate_contract_article_link_replacement("gsr", 18, "TBD"),
  generate_contract_article_link_replacement("gsr", 19, "No Strikes"),
  generate_contract_article_link_replacement("gsr", 20, "Non-Discrimination in Employment"),
  generate_contract_article_link_replacement("gsr", 21, "TBD"),
  generate_contract_article_link_replacement("gsr", 22, "TBD"),
  generate_contract_article_link_replacement("gsr", 23, "TBD"),
  generate_contract_article_link_replacement("gsr", 24, "Reasonable Accommodation"),
  generate_contract_article_link_replacement("gsr", 25, "TBD"),
  generate_contract_article_link_replacement("gsr", 26, "TBD"),
  generate_contract_article_link_replacement("gsr", 27, "TBD"),
  generate_contract_article_link_replacement("gsr", 28, "TBD"),
  generate_contract_article_link_replacement("gsr", 29, "No Strikes"),
  generate_contract_article_link_replacement("gsr", 30, "Union Access and Rights"),
  generate_contract_article_link_replacement("gsr", 31, "Union Security"),
  # Put single-digit articles last so that we math "Article 20" first, instead of 
  # erroneously linking "Article 2"0
  generate_contract_article_link_replacement("gsr", 1,  "Recognition"),
  generate_contract_article_link_replacement("gsr", 2,  "TBD"),
  generate_contract_article_link_replacement("gsr", 3,  "TBD"),
  generate_contract_article_link_replacement("gsr", 4,  "Childcare"),
  generate_contract_article_link_replacement("gsr", 5,  "TBD"),
  generate_contract_article_link_replacement("gsr", 6,  "TBD"),
  generate_contract_article_link_replacement("gsr", 7,  "Discipline and Dismissal"),
  generate_contract_article_link_replacement("gsr", 8,  "TBD"),
  generate_contract_article_link_replacement("gsr", 9,  "TBD"),
  # Appendices
  generate_contract_appendix_link_replacement('gsr', 'A', 'br_appendix-a_grievance-form_2022-2025'),
  generate_contract_appendix_link_replacement('gsr', 'B', 'br_appendix-b_panel-of-abitrators_2022-2025'),
  generate_contract_appendix_link_replacement('gsr', 'C', 'br_appendix-c_mef-form_2022-2025'),
  generate_contract_appendix_link_replacement('gsr', 'F', 'br_appendix-f_defined-contribution-plan_2022-2025'),
  generate_contract_appendix_link_replacement('gsr', 'H', 'br_appendix-h_work-incurred-injury-and-illness_sl'),
  generate_contract_appendix_link_replacement('gsr', 'J', 'br_appendix-j_gsr-initial-deductions_sl_2022-2025')
]


ase_article_links_replacements = [
  generate_contract_article_link_replacement("ase", 10, "Employment Files and Evaluation"),
  generate_contract_article_link_replacement("ase", 11, "Employment Files and Evaluation"),
  generate_contract_article_link_replacement("ase", 12, "Grievance and Arbitration"),
  generate_contract_article_link_replacement("ase", 13, "Health and Safety"),
  generate_contract_article_link_replacement("ase", 14, "Health Benefits"),
  generate_contract_article_link_replacement("ase", 15, "Holidays"),
  generate_contract_article_link_replacement("ase", 16, "Immigration"),
  generate_contract_article_link_replacement("ase", 17, "Labor Management Meetings"),
  generate_contract_article_link_replacement("ase", 18, "Leaves"),
  generate_contract_article_link_replacement("ase", 19, "Management and Academic Rights"),
  generate_contract_article_link_replacement("ase", 20, "No Strikes"), # Misnumbered as "Article 19" in Article 12.
  generate_contract_article_link_replacement("ase", 21, "Non-Discrimination in Employment"),
  generate_contract_article_link_replacement("ase", 22, "Parking and Transit"),
  generate_contract_article_link_replacement("ase", 23, "Posting"),
  generate_contract_article_link_replacement("ase", 24, "Reasonable Accommodation"),
  generate_contract_article_link_replacement("ase", 25, "Respectful Work Environment"),
  generate_contract_article_link_replacement("ase", 26, "Severability"),
  generate_contract_article_link_replacement("ase", 27, "Summer Session"),
  generate_contract_article_link_replacement("ase", 28, "Training & Orientation"),
  generate_contract_article_link_replacement("ase", 29, "Travel"),
  generate_contract_article_link_replacement("ase", 30, "Union Access and Rights"),
  generate_contract_article_link_replacement("ase", 31, "Union Security"),
  generate_contract_article_link_replacement("ase", "32(A)", "General Wages"),
  generate_contract_article_link_replacement("ase", "32(b)", "Special Wages"),
  generate_contract_article_link_replacement("ase", 32, "TBD"),# Default to General wages
  generate_contract_article_link_replacement("ase", 33, "Waiver"),
  generate_contract_article_link_replacement("ase", 34, "Workload"),
  generate_contract_article_link_replacement("ase", 35, "Workspace and Instructional Support"),
  generate_contract_article_link_replacement("ase", 36, "Duration"),
  # Put single-digit articles last so that we math "Article 20" first, instead of 
  # erroneously linking "Article 2"0
  generate_contract_article_link_replacement("ase", 1,  "Recognition"),
  generate_contract_article_link_replacement("ase", 2,  "Appointment Notification"),
  generate_contract_article_link_replacement("ase", 3,  "Appointment Security"),
  generate_contract_article_link_replacement("ase", 4,  "Childcare"),
  generate_contract_article_link_replacement("ase", 5,  "Classifications"),
  generate_contract_article_link_replacement("ase", 6,  "Contribution Plans"),
  generate_contract_article_link_replacement("ase", 7,  "Definitions"),
  generate_contract_article_link_replacement("ase", 8,  "Discipline and Dismissal"),
  generate_contract_article_link_replacement("ase", 9,  "Emergency Layoff"),
  # Appendices
  generate_contract_appendix_link_replacement('ase', 'A', 'bx_appendix-a_step-2-grievance-form_2022-2025'),
  generate_contract_appendix_link_replacement('ase', 'B', 'bx_appendix-b_panel-of-arbitrators_2022-2025'),
  generate_contract_appendix_link_replacement('ase', 'C', 'bx_appendix-c_mef-form_2022-2025'),
  generate_contract_appendix_link_replacement('ase', 'D', 'bx_appendix-d_jlmc-workplace-accessibility_2022-2025'),
  generate_contract_appendix_link_replacement('ase', 'E', 'bx_appendix-e_ase-sample-appt-letter_2022-2025'),
  generate_contract_appendix_link_replacement('ase', 'F', 'bx_appendix-f_defined-contribution-plan_2022-2025'),
  generate_contract_appendix_link_replacement('ase', 'I', 'bx_appendix-i_union-security-template_2022-2025'),
  generate_contract_appendix_link_replacement('ase', 'K', 'bx_appendix-k_respectful-fair-treatment-offices_2022-2025'),
  generate_contract_appendix_link_replacement('ase', 'L', 'bx_appendix-l_neo-information_2022-2025')
]

def generate_tooltip_to_show_meaning(term_key, alternate_matches=[]):
  term_with_first_capitalized = term_key[0].upper() + term_key[1:]
  substitute = '\\1<span class="tooltip">\\2<span class="tooltip-text">' \
              + f'<b>{term_with_first_capitalized}</b>: ' \
              + '{% assign tooltip_term = site.data.union_glossary | where: "Term", "' \
              + term_key + '" %}{{ tooltip_term[0]["Meaning"] }}</span></span>'

  # Allow plurals and include trailing punctuation so it is not dropped to the next line.
  suffix = "(?:s|es)?[,.]?"
  match_str = f"|".join([term_key] + alternate_matches)
  start_is_not_header = r'^[^#\n]'
  return (rf'(?i)({start_is_not_header}.*?)\b((?:{match_str}){suffix})\b', substitute)

  # plural_suffix = "(?:s|es)?"
  # match_str = f"|".join([term_key] + alternate_matches)
  # start_is_not_header = r'^[^#\n]'
  # return (rf'(?i)({start_is_not_header}.*?)\b((?:{match_str}){plural_suffix})', substitute)

tooltip_replacements = [
  # generate_tooltip_to_show_meaning("Memorandum of understanding"),
  generate_tooltip_to_show_meaning("Academic Student Employee", ["ASE"]),
  # We prohibit "term" from being replaced if it inside a quotation marks because that causes '"Term"' 
  # to be replaced in {% assign tooltip_term = site.data.union_glossary | where: "Term", "Academic Student Employee" %}{{ tooltip_term[0]["Meaning"] }}.
  # We also do a negated lookahead to make sure "term" is not part of a phrase like "term of appointment."
  generate_tooltip_to_show_meaning("academic term", ["(?<!\")term(?=! of)(?=!s of)"]),
  # Include "\\b" word boundies to ensure AR is not matched in the middles of a word.
  generate_tooltip_to_show_meaning("Academic Researcher", ["\\bAR\\b"]), 
  generate_tooltip_to_show_meaning("American Federation of Labor and Congress of Industrial Organizations", ["AFL-CIO"]),
  generate_tooltip_to_show_meaning("arbitration", ["arbitrator", "arbitrable"]),
  generate_tooltip_to_show_meaning("Board of Regents", ["Board of Regents", "The Regents", "Regents"]),
  generate_tooltip_to_show_meaning("concerted activity", ["concerted activities"]),
  generate_tooltip_to_show_meaning("complainant", []),
  generate_tooltip_to_show_meaning("counseling memoranda", ["counseling memo"]),
  generate_tooltip_to_show_meaning("Deferred Action for Childhood Arrivals", ["DACA"]),
  generate_tooltip_to_show_meaning("Defined Contribution Plan", ["Defined Contribution Plan", "DC Plan", "DCP"]),
  generate_tooltip_to_show_meaning("DC Plan Safe Harbor", ["Safe Harbor"]),
  generate_tooltip_to_show_meaning("DC Plan Voluntary Contribution", []),
  generate_tooltip_to_show_meaning("de minimis", []),
  generate_tooltip_to_show_meaning("Dependent Care Flexible Spending Accounts", ["DepCare"]),
  generate_tooltip_to_show_meaning("Equal Employment Opportunity", ["EEO"]),
  generate_tooltip_to_show_meaning("full-time equivalent", ["FTE"]),
  generate_tooltip_to_show_meaning("graduate student researcher", ["GSR"]),
  generate_tooltip_to_show_meaning("Graduate Student Research Assistant", ["GSRA"]),
  generate_tooltip_to_show_meaning("Graduate Student Instructor", ["GSI"]),
  generate_tooltip_to_show_meaning("grievance", ["grievant", "grievable"]),
  generate_tooltip_to_show_meaning("Higher Education Employer-Employee Relations Act", ["HEERA", "Higher Education Employee Employer Relations Act"]),
  generate_tooltip_to_show_meaning("insurance premium", ["premium"]),
  generate_tooltip_to_show_meaning("loco parentis", []),
  generate_tooltip_to_show_meaning("lockout"),
  generate_tooltip_to_show_meaning("UAW Local Union 2865", ["Local Union 2865", "UAW 2865"]),
  generate_tooltip_to_show_meaning("UAW Local Union 5810", ["Local Union 5810", "UAW 5810"]),
  generate_tooltip_to_show_meaning("Public Employment Relations Board", ["PERB"]),
  generate_tooltip_to_show_meaning("UC Office of the President", ["UCOP", "Office of the President"]),
  generate_tooltip_to_show_meaning("Nonresident Supplemental Tuition", ["NRST"]),
  generate_tooltip_to_show_meaning("University of California Retirement Program", ["UCRP"]),
  generate_tooltip_to_show_meaning("UCPath", []),
  generate_tooltip_to_show_meaning("teaching assistant", ["TA"]),
  generate_tooltip_to_show_meaning("Partial Fee Remission", ["Fee Remission"]),
  generate_tooltip_to_show_meaning("strike", []),
  generate_tooltip_to_show_meaning("Student Services Fee", []),
  generate_tooltip_to_show_meaning("System-wide Childcare Reimbursement Program", []),
  generate_tooltip_to_show_meaning("Sexual Violence and Sexual Harassment", ["SVSH"]),
  generate_tooltip_to_show_meaning("Title IX", []),
  generate_tooltip_to_show_meaning("UC Student Health Insurance Plan", ["UC SHIP", "UCSHIP"]),
  generate_tooltip_to_show_meaning("retaliation", []),
  generate_tooltip_to_show_meaning("respondent", []),
  generate_tooltip_to_show_meaning("reasonable accommodation", []),
  generate_tooltip_to_show_meaning("Voluntary Community Action Program", ["VCAP"]),
  generate_tooltip_to_show_meaning("warning letter", ["written warning"]),
  generate_tooltip_to_show_meaning("Self-supporting graduate professional degree program", 
                                   ["Self Supporting Programs", "Self-Supporting Programs", "self-supporting graduate degree program"])
]

# def generate_hyperlink_replacement(word_to_link, url):
#   return (r'^(\d\.)\ (.*)$',  
#       f'<div class="lvl2"><b>\\1</b> \\2</div>'),

# hyperlinking_replacements = [
#   # (r'\bUAW\b',  
#   #     f'<a href="">UAW</a>'),
# ]

mathpix_formatting_correction_replacements = [
  (r'\$(\d+(?:\.\d+)?) \\%\$',  
        f'\\1%'),
  # Replace "\&" with "&"
  (r'\\&', f'&'),
]


# TODO: Implement non-header replacements for tooltips so that they are never placed in headers.
non_header_replacements = tooltip_replacements
def apply_non_header_replacements_if_not_header(content, replacements):
  for pattern, replacement in non_header_replacements:
    # content = re.sub(pattern, replacement, content, 0, re.MULTILINE | re.DOTALL)
    content = re.sub(pattern, replacement, content, 0, re.MULTILINE)
  return content

# for enumerate_pattern in [r'\d\.', r' ']:
#   # Preprocess enumerations to make sure that each item starts on a new line.
#   replacements += [(rf'\ ({enumerate_pattern})\ ', f'\n\\1 ')]

# replacements += generate_list_replacement(['a', 'b', 'z'], 'alpha-list', item_format=None, pattern_for_end_of_list=r'\s\d\.\s') 
# replacements += generate_list_replacement(['1', '2', '9'], 'arabic-list', item_format=None, pattern_for_end_of_list=r'##') 
# replacements += generate_list_replacement(['A', 'B', 'Z'], 'Alpha-list', item_format=None, pattern_for_end_of_list=r'##') 

# ------ Article Headers ------ 
gsr_article_header_format = """---
contract: GSR 2022-2025
article_number: {0}
article_name: {1}
title: Article {0} - {1}
permalink: /uaw/gsr-2022-2025-contract/article-{0}
pdf_name: {2}
toc: True
---
"""
ase_article_header_format = """---
contract: ASE 2022-2025
article_number: {0}
article_name: {1}
title: Article {0} - {1}
permalink: /uaw/ase-2022-2025-contract/article-{0}
pdf_name: {2}
toc: True
---
"""
# ------ Appendix Headers ------ 
gsr_appendix_header_format = """---
contract: GSR 2022-2025
appendix_letter: {0}
appendix_name: {1}
title: Appendix {0} - {1}
permalink: /uaw/gsr-2022-2025-contract/appendix-{0}
pdf_name: {2}
toc: True
---
"""
ase_appendix_header_format = """---
contract: ASE 2022-2025
appendix_letter: {0}
appendix_name: {1}
title: Appendix {0} - {1}
permalink: /uaw/ase-2022-2025-contract/appendix-{0}
pdf_name: {2}
toc: True
---
"""


def insert_header(contract, filename, content):
    # article_title_pattern = r'^# (ARTICLE (?P<article_num>\d+)(?P<subarticle_letter>\([AB]\))?|APPENDIX (?P<appendix_letter>[A-Z]))\s(?:\<br\>\s*)?(?P<title>.*)$'
    article_title_pattern = r'^# ARTICLE (?P<article_num>\d+)(?P<subarticle_letter>\([AB]\))?\s(?:\<br\>\s*)?(?P<title>.*)$'

  
    pdf_filename = os.path.splitext(filename)[0] + ".pdf"

    if contract == "ase":
      header_format = ase_article_header_format
    elif contract == "gsr":
      header_format = gsr_article_header_format
    else:
      raise ValueError(f'Unexpected case.')
      

    title_match = re.search(article_title_pattern, content, re.MULTILINE)
    if title_match:
      # Extract the values using named groups
      article_num = title_match.group('article_num')
      title = title_match.group('title')
      subarticle_letter = title_match.group('subarticle_letter')
      
      # print(f'header_format ({type(header_format)}): {header_format}')
    else:
      print(f'No header found for {filename}.')
      article_num = ""
      title = ""
      subarticle_letter = ""
   
    if subarticle_letter:
      number = f'{article_num}{subarticle_letter}' 
    else:
      number = article_num
    title = title.title()
    header = header_format.format(number, title, pdf_filename) 

    content = re.sub(article_title_pattern, header, content, 0, re.MULTILINE)
    return content


# Function to apply regex replacements to the content
def apply_replacements(content, replacements):
  for pattern, replacement in replacements:
    # content = re.sub(pattern, replacement, content, 0, re.MULTILINE | re.DOTALL)
    content = re.sub(pattern, replacement, content, 0, re.MULTILINE)
  return content



def main():
  # Create an argument parser
  parser = argparse.ArgumentParser(description="Generate sanitized contract markdown files for the GSR or ASE contracts.")

  # Add an argument that only accepts 'ase' or 'gsr'
  parser.add_argument(
    'contract', 
    choices=['ASE', 'GSR'], 
    help="Select the contract to generate as either 'ASE' or 'GSR' (case insensitive)."
  )

  # Parse command-line arguments
  args = parser.parse_args()
  # Get the provided "contract" value a
  contract_selection = args.contract.lower()

  # Get the path to the current script
  script_dir = os.path.dirname(os.path.realpath(__file__))

  # Generate the new path based on the mode
  contract_src_directory = os.path.join(script_dir, '..', f"{contract_selection}_contract_src")
  contract_out_directory = os.path.join(script_dir, '..', f"_uc_uaw_{contract_selection}_2022-2025_contract")

  # Normalize the path (e.g., resolve ".." to get an absolute path)
  contract_src_directory = os.path.normpath(contract_src_directory)
  contract_out_directory = os.path.normpath(contract_out_directory)

  # Output the generated path
  print(f"Source path: {contract_src_directory}")
  print(f"Output path: {contract_out_directory}")
  
  # TODO: RESTORE vvv
  replacements = mathpix_formatting_correction_replacements \
                + tooltip_replacements \
                + header_replacements
  if contract_selection == "ase":
    replacements += ase_article_links_replacements 
  elif contract_selection == "gsr":
    replacements += gsr_article_links_replacements 

  for replacement in replacements:
    print(str(replacement[0]) + " -> " + repr(replacement[1]))

  # Loop through all Markdown files in the current folder
  for filename in os.listdir(contract_src_directory):
    if not filename.endswith('.md'):  # Check for markdown files
      continue
  
    src_file_path = os.path.join(contract_src_directory, filename)
    out_file_path = os.path.join(contract_out_directory, filename)

    # Read the content of the markdown file
    with open(src_file_path, 'r', encoding='utf-8') as f:
      content = f.read()
    

    # Apply the regex replacements
    new_content = content
    new_content = apply_replacements(new_content, replacements)
    new_content = insert_header(contract_selection, filename, new_content)
    

    # Write the modified content back to the file
    with open(out_file_path, 'w', encoding='utf-8') as f:
      f.write(new_content)

    # print(f"Processed file: {filename}")

if __name__ == "__main__":
  main()
