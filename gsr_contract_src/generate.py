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
  (r'^#+\s*([A-Z]\.)\s*(.*)$', # Level 1
      f'## \\1 \\2'),
  (r'^#+\s*(\d\.)\s*(.*)$', # Level 2
      f'### \\1 \\2'),
  (r'^#+\s*([a-z]\.)(.*)$', # Level 3
      f'#### \\1 \\2'),
  (r'^#+\s*([a-z]\))\s*(.*)$',  # Level 3 (alterative - see article 11)
      f'#### \\1 \\2'),
  # When a line does not start with "#", then it is 
  (r'^([A-Z]\.)\ (.*)$',  
      f'<div class="lvl1"><b>\\1</b> \\2</div>'), # Level 1
  (r'^(\d\.)\ (.*)$',  
      f'<div class="lvl2"><b>\\1</b> \\2</div>'), # Level 2
  (r'^(\d\))\ (.*)$',  
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
  (r'^(\d\.)\ (.*)$',  
      f'<div class="lvl2"><b>\\1</b> \\2</div>'),
  (r'^(\ \ \d\))(.*)$',  
      f'<div class="lvl3"><b>\\1</b> \n \\2</div>') # Level 3
]


def generate_tooltip_to_show_meaning(term_key, alternate_matches=[]):

  substitute = '<span class="tooltip">\\1<span class="tooltip-text">{% assign tooltip_term = site.data.union_glossary | where: "Term", "' + term_key + '" %}{{ tooltip_term[0]["Meaning"] }}</span></span>'

  match_str = "|".join([term_key] + alternate_matches)
  return (rf'(?i)\b({match_str})\b', substitute)

tooltip_replacements = [
  # generate_tooltip_to_show_meaning("Memorandum of understanding"),
  generate_tooltip_to_show_meaning("Board of Regents", ["Board of Regents", "The Regents", "Regents"]),
  generate_tooltip_to_show_meaning("graduate student researcher", ["GSR"]),
  generate_tooltip_to_show_meaning("Higher Education Employer-Employee Relations Act", ["HEERA"]),
  generate_tooltip_to_show_meaning("Public Employment Relations Board", ["PERB"]),
  generate_tooltip_to_show_meaning("UC Retirement Plan", ["UCRP"])
  # generate_tooltip_to_show_meaning("Public Employment Relations Board", ["PERB"]),
  # generate_tooltip_to_show_meaning("Public Employment Relations Board", ["PERB"]),
  # generate_tooltip_to_show_meaning("Public Employment Relations Board", ["PERB"])
]

def generate_hyperlink_replacement(word_to_link, url):
  (r'^(\d\.)\ (.*)$',  
      f'<div class="lvl2"><b>\\1</b> \\2</div>'),

hyperlinking_replacements = [
  # (r'\bUAW\b',  
  #     f'<a href="">UAW</a>'),
]

mathpix_formatting_correction_replacements = [
  (r'\$(\d+(?:\.\d+)?) \\%\$',  
        f'\\1%'),
]

replacements = mathpix_formatting_correction_replacements + header_replacements + hyperlinking_replacements + tooltip_replacements
# for enumerate_pattern in [r'\d\.', r' ']:
#   # Preprocess enumerations to make sure that each item starts on a new line.
#   replacements += [(rf'\ ({enumerate_pattern})\ ', f'\n\\1 ')]

# replacements += generate_list_replacement(['a', 'b', 'z'], 'alpha-list', item_format=None, pattern_for_end_of_list=r'\s\d\.\s') 
# replacements += generate_list_replacement(['1', '2', '9'], 'arabic-list', item_format=None, pattern_for_end_of_list=r'##') 
# replacements += generate_list_replacement(['A', 'B', 'Z'], 'Alpha-list', item_format=None, pattern_for_end_of_list=r'##') 

for replacement in replacements:
  print(str(replacement[0]) + " -> " + repr(replacement[1]))
# [
# 
# # Find the first times in lists enumerates with "a.", "b.", etc.
# (r'\sa\.\s(.*?)(?=\sb\.\s)',  
# """
# <ol class="alpha-list">
# \t<li>\\1</li>
# """),
# # Replace middle
# (r'\s[b-z]\.\s(.*?)(?=\s[c-z]\.\s)', "\t<li>\\1</li>\n"),
# # Replace last 
# (r'((?:\s[a-m]\.\s.*?)*)\s[b-m]\.\s(.*?)(?=\s\d\.\s|\Z)',
# "\\1\t<li>\\2</li>\n</ol>\n"
# )
#  
# 
# ]

header_format = """---
article_number: {0}
article_name: {1}
title: Article {0} - {1}
pdf_name: {2}
toc: True
---
"""
def insert_header(filename, content):
    article_title_pattern = r'^# ARTICLE (?P<article_num>\d+)\s(?:\<br\>\s*)?(?P<article_name>.*\b).*$'
  
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
    
    content = insert_header(filename, content)

    # Apply the regex replacements
    new_content = apply_replacements(content, replacements)

    # Write the modified content back to the file
    with open('../_uc_uaw_gsr_2022-2025_contract/' + filename, 'w', encoding='utf-8') as f:
      f.write(new_content)

    # print(f"Processed file: {filename}")

if __name__ == "__main__":
  main()
