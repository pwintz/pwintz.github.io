#!/usr/bin/env python3
import os
import re
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


# def generate_header_replacements

# Define the list of (pattern, replacement) tuples for regex replacements
header_replacements = [
  # When a line starts with "#" it will be made into a header
  (r'^#+\s*([A-Z]\.)(.*)$', # Level 1
      f'## \\1 \\2'),
  (r'^#+\s*(\d{1,2}\.)(.*)$', # Level 2
      f'### \\1 \\2'),
  (r'^#+\s*([a-z]\.)(.*)$', # Level 3
      f'#### \\1 \\2'),
  (r'^#+\s*([a-z]\))(.*)$',  # Level 3 (alterative - see article 11)
      f'#### \\1 \\2'),
  # When a line does not start with "#", then it is 
  (r'^([A-Z]\.)\ (.*)$',  
      f'<div class="lvl1"><b>\\1</b> \\2</div>'), # Level 1
  (r'^(\d{1,2}\.)\ (.*)$',  
      f'<div class="lvl2"><b>\\1</b> \\2</div>'), # Level 2
  (r'^(\d{1,2}\))\ (.*)$',  
      f'<div class="lvl2"><b>\\1</b> \\2</div>'), # Level 2 (alternate)
  (r'^([a-z]\.)\ (.*)$',  
      f'<div class="lvl3"><b>\\1</b> \n \\2</div>'), # Level 3
  (r'^\s*([a-z]\))\ (.*)$',  # Level 3 (alterative - see article 11)
    f'<div class="lvl3"><b>\\1</b> \\2</div>'),
  (r'^(\ \ (?:i|ii|iii|iv|v|vi|vii|viii|ix|x|xi|xii)\.)(.*)$',  
      f'<div class="lvl4">\\1 \n \\2</div>'),
  (r'^(\ \ \((?:i|ii|iii|iv|v|vi|vii|viii|ix|x|xi|xii)\))(.*)$',  
      f'<div class="lvl4">\\1 \n \\2</div>'),
  # On article 11, the enumerations randomly switches to 1), 2)... and II., 
  (r'^(\ \ (?:I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII)\.)\ (.*)$',  
      f'<div class="lvl4">\\1 \n \\2</div>'),
  (r'^(\d{1,2}\.)\ (.*)$',  
      f'<div class="lvl2"><b>\\1</b> \\2</div>'),
  (r'^(\ \ \d{1,2}\))(.*)$',  
      f'<div class="lvl3"><b>\\1</b> \n \\2</div>'), # Level 3,
  (r'^(\ \ [a-z]\))(.*)$',  
      f'<div class="lvl3"><b>\\1</b> \n \\2</div>') # Level 3
]

def generate_contract_article_link_replacement(number, name):
  return (rf'(?<!\S"\>)(Article {number}(?:\ | -| - |, ){name}|Article {number})', f'<a href="/uaw/gsr-2022-2025-contract/article-{number}">\\1</a>')

# def generate_contract_appendix_link_replacement(number, name):
#   return (rf'(Appendix {number}\ -\ {name}|Article {number})', f'<a href="/uaw/gsr-2022-2025-contract/article-{number}">\\1</a>')

article_links_replacements = [
  generate_contract_article_link_replacement(10, "Labor-Management Meetings"),
  generate_contract_article_link_replacement(11, "Grievance and Arbitration"),
  generate_contract_article_link_replacement(12, "TBD"),
  generate_contract_article_link_replacement(13, "TBD"),
  generate_contract_article_link_replacement(14, "TBD"),
  generate_contract_article_link_replacement(15, "TBD"),
  generate_contract_article_link_replacement(16, "TBD"),
  generate_contract_article_link_replacement(17, "Leaves of Absence"),
  generate_contract_article_link_replacement(18, "TBD"),
  generate_contract_article_link_replacement(19, "No Strikes"),
  generate_contract_article_link_replacement(20, "Non-Discrimination in Employment"),
  generate_contract_article_link_replacement(21, "TBD"),
  generate_contract_article_link_replacement(22, "TBD"),
  generate_contract_article_link_replacement(23, "TBD"),
  generate_contract_article_link_replacement(24, "Reasonable Accommodation"),
  generate_contract_article_link_replacement(25, "TBD"),
  generate_contract_article_link_replacement(26, "TBD"),
  generate_contract_article_link_replacement(27, "TBD"),
  generate_contract_article_link_replacement(28, "TBD"),
  generate_contract_article_link_replacement(29, "No Strikes"),
  generate_contract_article_link_replacement(30, "Union Access and Rights"),
  generate_contract_article_link_replacement(31, "Union Security"),
  # Put single-digit articles last so that we math "Article 20" first, instead of 
  # erroneously linking "Article 2"0
  generate_contract_article_link_replacement(1,  "Recognition"),
  generate_contract_article_link_replacement(2,  "TBD"),
  generate_contract_article_link_replacement(3,  "TBD"),
  generate_contract_article_link_replacement(4,  "Childcare"),
  generate_contract_article_link_replacement(5,  "TBD"),
  generate_contract_article_link_replacement(6,  "TBD"),
  generate_contract_article_link_replacement(7,  "Discipline and Dismissal"),
  generate_contract_article_link_replacement(8,  "TBD"),
  generate_contract_article_link_replacement(9,  "TBD"),
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
  generate_tooltip_to_show_meaning("UC Retirement Plan", ["UCRP"])
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

replacements = mathpix_formatting_correction_replacements \
               + tooltip_replacements \
               + header_replacements \
               + article_links_replacements 
# for enumerate_pattern in [r'\d\.', r' ']:
#   # Preprocess enumerations to make sure that each item starts on a new line.
#   replacements += [(rf'\ ({enumerate_pattern})\ ', f'\n\\1 ')]

# replacements += generate_list_replacement(['a', 'b', 'z'], 'alpha-list', item_format=None, pattern_for_end_of_list=r'\s\d\.\s') 
# replacements += generate_list_replacement(['1', '2', '9'], 'arabic-list', item_format=None, pattern_for_end_of_list=r'##') 
# replacements += generate_list_replacement(['A', 'B', 'Z'], 'Alpha-list', item_format=None, pattern_for_end_of_list=r'##') 

for replacement in replacements:
  print(str(replacement[0]) + " -> " + repr(replacement[1]))
header_format = """---
article_number: {0}
article_name: {1}
title: Article {0} - {1}
permalink: /uaw/gsr-2022-2025-contract/article-{0}
pdf_name: {2}
toc: True
---
"""
def insert_header(filename, content):
    article_title_pattern = r'^# ARTICLE (?P<article_num>\d+)\s(?:\<br\>\s*)?(?P<article_name>.*)$'
  
    pdf_filename = os.path.splitext(filename)[0] + ".pdf"

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
    
  # Loop through all Markdown files in the current folder
  for filename in os.listdir('.'):
    if not filename.endswith('.md'):  # Check for markdown files
      continue
  
    # Read the content of the markdown file
    with open(filename, 'r', encoding='utf-8') as f:
      content = f.read()
    

    # Apply the regex replacements
    new_content = apply_replacements(content, replacements)
    
    new_content = insert_header(filename, new_content)

    # Write the modified content back to the file
    with open('../_uc_uaw_gsr_2022-2025_contract/' + filename, 'w', encoding='utf-8') as f:
      f.write(new_content)

    # print(f"Processed file: {filename}")

if __name__ == "__main__":
  main()
