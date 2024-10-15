---
layout: single
permalink: /uaw/glossary
title: UCSC UAW 4811 Union Glossary
---

<style>
table {
  text-align: left;
  position: relative;
}
th {
  text-align: left;
  background: white;
  position: sticky;
  top: 0;
  background-color: lightblue; 
}

/* Show sort symbols before they are clicked */
table.sortable th:not(.sorttable_sorted):not(.sorttable_sorted_reverse):not(.sorttable_nosort):after { 
    content: " \25B4\25BE" 
}

/* Styling for search box */
#myInput {
  background-image: url('/css/searchicon.png'); /* Add a search icon to input */
  background-position: 10px 12px; /* Position the search icon */
  background-repeat: no-repeat; /* Do not repeat the icon image */
  width: 100%; /* Full-width */
  font-size: 16px; /* Increase font-size */
  padding: 12px 20px 12px 40px; /* Add some padding */
  border: 1px solid #ddd; /* Add a grey border */
  margin-bottom: 12px; /* Add some space below the input */
}

#glossaryTable {
  border-collapse: collapse; /* Collapse borders */
  width: 100%; /* Full-width */
  border: 1px solid #ddd; /* Add a grey border */
  font-size: 18px; /* Increase font-size */
}

#glossaryTable th, #glossaryTable td {
  text-align: left; /* Left-align text */
  padding: 12px; /* Add padding */
}

#glossaryTable tr {
  /* Add a bottom border to all table rows */
  border-bottom: 1px solid #ddd;
}

#glossaryTable tr.header, #glossaryTable tr:hover {
  /* Add a grey background color to the table header and on hover */
  background-color: #f1f1f1;
}

#glossaryTable th.rarity, #glossaryTable td.rarity {
  /* Add a grey background color to the table header and on hover */
  display: none;
}


/* Toggle button */
/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 28px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
  /* Make it round */
  border-radius: 28px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
  
  /* Make it round */
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(20px);
  -ms-transform: translateX(20px);
  transform: translateX(20px);
}

</style>

<script src="https://www.kryogenix.org/code/browser/sorttable/sorttable.js"></script>


<script>
function filterTableRows() {
  // Declare variables
  var input, filter, table, rows, td, i_row, i_cell, txtValue;
  var is_match, rarity;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("glossaryTable");
  rows = table.getElementsByTagName("tr");
  hideUncommons = document.querySelector('#hideUncommonsToggle').checked;
  // hideUncommonsToggle = document.getElementById("hideUncommonsToggle")
  // console.log(hideUncommons )

  // Loop through all table rows, and hide those who don't match the search query
  for (i_row = 0; i_row < rows.length; i_row++) {
    row = rows[i_row];
    cells = rows[i_row].getElementsByTagName("td");
    
    is_header = row.className == "header";
    // if (row.className == "header") {
    //   // If it is the header, then we don't ever hide it.
    //   is_match = true;
    // }

    // Check if any of the cells contain the search text.
    is_match = false;
    for (i_cell = 0; i_cell < cells.length; i_cell++) {
      td = cells[i_cell];
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        is_match = true;
        break;
      } 
    }

    rarity_cell = row.getElementsByClassName("rarity")[0];
    rarity = rarity_cell.textContent || rarity_cell.innerText;
    rarity = rarity.trim();
    is_visible_rarity = !hideUncommons || rarity == "Common";
    // console.log("hideUncommons:" + hideUncommonsToggle)
    
    is_visible = is_header || (is_visible_rarity && is_match);

    // console.log("is_header:" + is_header)
    // console.log("is_visible_rarity:" + is_visible_rarity)
    // console.log("is_match:" + is_match)
    console.log("-> is_visible:" + is_visible)
      

    // Hide or show the row.
    if (is_visible) {
      rows[i_row].style.display = "";
    } else {
      rows[i_row].style.display = "none";
    }
    rarity_cell.style.display = "none";
    // td = rows[i_row].getElementsByTagName("td")[0];
    // if (td) {
    //   txtValue = td.textContent || td.innerText;
    //   if (txtValue.toUpperCase().indexOf(filter) > -1) {
    //     rows[i_row].style.display = "";
    //   } else {
    //     rows[i_row].style.display = "none";
    //   }
    // }
  }
}
</script>

<br>
<input type="text" id="myInput" onkeyup="filterTableRows()" placeholder="Find text (exact matches only)...">

<!-- <div text-align="center"> -->
Hide Uncommon Terms? 
<label class="switch">
  <input type="checkbox" onclick="filterTableRows()" id="hideUncommonsToggle">
  <span class="slider"></span>
</label>
<!-- </div> -->

<table class="sortable" id="glossaryTable" table-layout="fixed" width="100%">
  <tr class="header">
    <th  width="25%">
      Term
    </th>
    <th  width="65%" >
      Meaning
    </th>
    <th  maxwidth="10%" >
      Links
    </th>
    <th class="rarity">
      Rarity
    </th>
  </tr>
  {% for row in site.data.union_glossary %}
    <!-- {% if forloop.first %}
    <tr>
      {% for pair in row %}
        <th>{{ pair[0] }}</th>
      {% endfor %}
    </tr>
    {% endif %} -->

    <tr>
      <td>
      {{ row["Term"] }} 
      {% if row["Abbreviations"] %}
       <nobr>({{ row["Abbreviations"] }})</nobr>
      {% endif %}
      </td>
      <td>
      {{ row["Meaning"] }}
      </td>
      <td class="row links">
        {% assign links = row["Markdown Links"] | split: ',' %}
        {% for link in links %}
          link
          (link)
          {{ link | markdownify }}
        {% endfor %}
        {{ row["Markdown Links"] | markdownify }}
      </td>
      <td class="rarity">
        {{ row["Rarity"] }}
      </td>
    </tr>
  {% endfor %}
</table>