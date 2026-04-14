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


markdown_header_pattern = '^#'

# def generate_header_replacements

lowercase_roman_numerals = r'x{0,2}(?:i{1,3}|iv|vi{0,3}|ix|x)'
uppercase_roman_numerals = r'(?:I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII)'

lower_roman_item = rf'(?:{lowercase_roman_numerals}\.|\({lowercase_roman_numerals}\))'
upper_roman_item = rf'{uppercase_roman_numerals}\.'
upper_alph_item = r'[A-Z]\.'
lower_alph_item = r'(?:[a-z]\.|[a-z]\))'
arabic_item = r'(?:\d{1,2}\.|\d{1,2}\))'
all_items = rf'(?:{lowercase_roman_numerals}|{uppercase_roman_numerals}|{lower_alph_item}|{upper_alph_item})'

# Define the list of (pattern, replacement) tuples for regex replacements
header_replacements = [
  # --- When a line starts with "#" it will be made into a header --- 
  # Level 1 header (default)
  (rf'^#+\s*({upper_alph_item})(.*)$', f'## \\1 \\2'),
  # Level 2 header (default)
  (rf'^#+\s*({arabic_item})(.*)$', f'### \\1 \\2'),
  # Level 3 header (default)
  (rf'^#+\s*({lower_alph_item})(.*)$', f'#### \\1 \\2'),
  # When a line does not start with "#", then it is not a header
  (rf'^({upper_alph_item})\ (.*)$',  f'<div class="lvl1"><b>\\1</b> \\2</div>'), # Level 1 - non-header (default)
  (rf'^({arabic_item})(.*)$',        f'<div class="lvl2"><b>\\1</b> \\2</div>'), # Level 2
  # (r'^(\d{1,2}\))\ (.*)$',           f'<div class="lvl2"><b>\\1</b> \\2</div>'), # Level 2 (alternate)
  (rf'^({lower_alph_item})\ (.*)$',             f'<div class="lvl3"><b>\\1</b> \\2</div>'), # Level 3 - non-header
  # (r'^\s*([a-z]\))\ (.*)$',  # Level 3 (alterative - see article 11)
    # f'<div class="lvl3"><b>\\1</b> \\2</div>'),
  # Any of the itemization types prefixed by two spaces will be rendered as level 3
  (rf'^\ \ ({all_items}) (.*)$', f'<div class="lvl3"><b>\\1</b> \n \\2</div>'),
  # Any of the itemization types prefixed by four spaces will be rendered as level 4
  (rf'^\ \ \ \ ({all_items}) (.*)$', f'<div class="lvl4"><b>\\1</b> \n \\2</div>'),
  # (rf'^(\ \ \({lowercase_roman_numerals}\))(.*)$',  
      # f'<div class="lvl4">\\1 \n \\2</div>'),
  # On article 11, the enumerations randomly switches to 1), 2)... and II., 
  # (rf'^(\ \ {uppercase_roman_numerals}\.)\ (.*)$',  
      # f'<div class="lvl3">\\1 \n \\2</div>'),
  # (rf'^(\ \ \ \ {uppercase_roman_numerals}\.)\ (.*)$',  
  #     f'<div class="lvl4">\\1 \n \\2</div>'),
  # (r'^(\d{1,2}\.)\ (.*)$',  
  #     f'<div class="lvl2"><b>\\1</b> \\2</div>'),
  # (r'^(\ \ \d{1,2}\))(.*)$',  
  #     f'<div class="lvl3"><b>\\1</b> \n \\2</div>'), # Level 3,
  #  (r'^(\ \ [a-z]\))(.*)$',  
  #     f'<div class="lvl3"><b>\\1</b> \n \\2</div>') # Level 3
]

def generate_contract_article_link_replacement(contract, number, name):
  return (rf'(?<!\S\"\>)(Article {number}(?: ?- ?|,\ |){name}|Article {number})', f'<a href="/uaw/{contract}-2022-2025-contract/article-{number}">\\1</a>')

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
  generate_contract_article_link_replacement("ase", 20, "No Strikes"),
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
  generate_contract_article_link_replacement("ase", "32A", "General Wages"),
  generate_contract_article_link_replacement("ase", "32b", "Special Wages"),
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
]

def generate_tooltip_to_show_meaning(term_key, alternate_matches=[]):

  substitute = '\\1<span class="tooltip">\\2<span class="tooltip-text">{% assign tooltip_term = site.data.union_glossary | where: "Term", "' + term_key + '" %}{{ tooltip_term[0]["Meaning"] }}</span></span>'

  plural_suffix = "(?:s|es)?"
  match_str = f"|".join([term_key] + alternate_matches)
  return (rf'(?i)^([^#].*?)\b((?:{match_str}){plural_suffix})', substitute)

tooltip_replacements = [
  # generate_tooltip_to_show_meaning("Memorandum of understanding"),
  generate_tooltip_to_show_meaning("Board of Regents", ["Board of Regents", "The Regents", "Regents"]),
  # generate_tooltip_to_show_meaning("graduate student researcher", ["GSR"]),
  generate_tooltip_to_show_meaning("Higher Education Employer-Employee Relations Act", ["HEERA", "Higher Education Employee Employer Relations Act"]),
  generate_tooltip_to_show_meaning("Public Employment Relations Board", ["PERB"]),
  # generate_tooltip_to_show_meaning("UC Office of the President", ["UCOP", "Office of the President"]),
  generate_tooltip_to_show_meaning("Nonresident Supplemental Tuition", ["NRST"]),
  generate_tooltip_to_show_meaning("University of California Retirement Program", ["UCRP"]),
  generate_tooltip_to_show_meaning("Defined Contribution Plan", ["Defined Contribution Plan", "DC Plan", "DCP"]),
  # generate_tooltip_to_show_meaning("Savings Choice", []),# TODO
  generate_tooltip_to_show_meaning("UCPath", []),
  generate_tooltip_to_show_meaning("grievance", ["grievant", "grievable"]),
  # generate_tooltip_to_show_meaning("arbitration", ["arbitrator", "arbitrable"])
  generate_tooltip_to_show_meaning("Counseling memoranda", []),
  generate_tooltip_to_show_meaning("Partial Fee Remission", ["Fee Remission"])# TODO
  # generate_tooltip_to_show_meaning("Public Employment Relations Board", ["PERB"]),
  # generate_tooltip_to_show_meaning("Public Employment Relations Board", ["PERB"]),
  # generate_tooltip_to_show_meaning("Public Employment Relations Board", ["PERB"])
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

gsr_header_format = """---
contract: GSR 2022-2025
article_number: {0}
article_name: {1}
title: Article {0} - {1}
permalink: /uaw/gsr-2022-2025-contract/article-{0}
pdf_name: {2}
toc: True
---
"""
ase_header_format = """---
contract: ASE 2022-2025
article_number: {0}
article_name: {1}
title: Article {0} - {1}
permalink: /uaw/ase-2022-2025-contract/article-{0}
pdf_name: {2}
toc: True
---
"""
def insert_header(contract, filename, content):
    article_title_pattern = r'^# ARTICLE (?P<article_num>\d+)\s(?:\<br\>\s*)?(?P<article_name>.*)$'
  
    pdf_filename = os.path.splitext(filename)[0] + ".pdf"

    if contract == "ase":
      header_format = ase_header_format
    elif contract == "gsr":
      header_format = gsr_header_format
    else:
      raise ValueError(f'Unexpected case.')
      

    title_match = re.search(article_title_pattern, content, re.MULTILINE)
    if title_match:
      # Extract the values using named groups
      article_num = title_match.group('article_num')
      article_name = title_match.group('article_name')
      
      # print(f'header_format ({type(header_format)}): {header_format}')
    else:
      article_num = ""
      article_name = ""
   
    header = header_format.format(article_num, article_name.title(), pdf_filename) 

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
    new_content = apply_replacements(content, replacements)
    
    new_content = insert_header(contract_selection, filename, new_content)

    # Write the modified content back to the file
    with open(out_file_path, 'w', encoding='utf-8') as f:
      f.write(new_content)

    # print(f"Processed file: {filename}")

if __name__ == "__main__":
  main()
