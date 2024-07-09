
/*
Rewrite only for test cases
Store in its own JSON file 
basis of indents by child insertion (current code viability)
try using parent node basis


Complete by 21st 
*/
import React, { useEffect, useRef } from 'react';
import $, { post } from 'jquery';
import 'jquery-ui/ui/widgets/button'; // Import specific jQuery UI components as needed
import './testui.css';

const Testui = () => {
    
    const tableRef = useRef(null);
  const newFieldRef = useRef(null);
  var rowCount=1;


  useEffect(() => {
let clickTimeout = null;
var editInuput;
    function editTestCase(td){
      var timer;
      td.onclick = function() {
        console.log("CLicked!");
        if (timer) clearTimeout(timer);
        timer = setTimeout(function() { 
             console.log("Is this is wuts getting mult-called ?"); 
             select(td);}, 300);
      }
    
      td.ondblclick = function() {
        console.log("Double Click");
        clearTimeout(timer);
        edit(td);
      }
    }

 
//Chagpt's insertTestCase funciton which attaches the editTestCase function to each row
function insertTestCase(td, id, val, parent) {
    const newRow = $("<tr>").attr("id", "row-" + rowCount).attr("data-parent", parent);
    const newCell = $("<td>").attr("id", "tc-" + rowCount).text(val);

    newRow.append(newCell);


 
    td.before(newRow);
    newCell.each(function() {
        editTestCase(this);
      });
    
    $("#newField").val('');
}

$("#newField").keypress(function (event) {
  if (event.key === 'Enter' && $("#newField").val() != "") {
        
      insertTestCase($("#insertTest"),rowCount,$("#newField").val(),null,0); // enter key pressed
      rowCount++;
  }});


  function edit(td) {
    var Input = document.createElement('input');
    Input.type = 'text';
    Input.value = td.textContent;
    td.innerHTML = '';
    td.appendChild(Input);
    Input.focus();
    Input.onkeydown =  function(event){
      if (event.key === 'Enter') {
        td.innerHTML = Input.value;
        
    }
    }
    $('tr').on('click', function() {
      if ($(this).index() !== $(Input).closest('tr').index()) {
        td.innerHTML = Input.value;
        Input.blur();
      }
    })
};

function highlight(td)
{
  console.log("high called",td);
  var row = $(td).closest("tr");
  $("tr").removeClass("selected");
  row.addClass("selected");
}

function select(td) {
    
    // Add event listeners for keyboard shortcuts
   
    var row = $(td).closest("tr");
    $("tr").removeClass("selected");
    row.addClass("selected");
    $(document).on("keypress", function(event) {
        console.log("Ok. so the function can be called.");
        console.log(event.key);
      if (event.key === "q") {
        console.log("See any Parent ? ");
        makeParent(row);
      } else if (event.key === "w") {
        console.log("Is this even being called??? ");
        unmakeParent(row);
      } else if (event.key === "Enter") {
        console.log("Enter key pressed, How is this even being called ?");
        console.log(String.fromCharCode(event.which));
        
        insert(row); // default value for val
      } else if (event.key === "r") {
        console.log("If a row dissapoears, Hallelugiah");
        deleteTestCase(row);
      }
    })
  }

  function insert(row,td) {
    console.log("Current row:",row);
    console.log("Next row:",row.next());
  
    if (row.hasClass("parent")) //Creating children
    {
      insertTestCase(row.next(),rowCount++,"New Test Case",row.id);
    }
    else //Sibiling
    {
      insertTestCase(row.next(),rowCount++,"New Test Case",row.data("parent"));
      td = $(row.next()).find("td");
      console.log("td1:",td);
    }
  }


// Make as parent (Tab)
function makeParent(row) {
  row.addClass("parent");
}

// Unmake parent and shift children back to siblings
function unmakeParent(row) {
  row.removeClass("parent");
  $("[id^='row-']").each(function (index) {
    var row = $(this);
    var parentId = row.attr('id').replace('row-', '');
    if (row.data('parent')) {
      row.attr('id', 'row-' + row.data('parent'));
    }
  });
}




// Delete test case (Delete)
function deleteTestCase(row) {
  if (row.hasClass("parent")) {
    unmakeParent(row);
  }
  row.remove();
}
const tableObserver = new MutationObserver(function (mutations) {
  $("tr").removeClass("selected");

});
tableObserver.observe(document.getElementById('test-table'), {
    childList: true,
    subtree: true
});

function readData() {
  var tableData=[];
  $("[id^='row-']").each(function (index) {
    index++;
    var ind=getNum(this.id);
    rowCount=rowCount>ind?rowCount:ind;
    console.log(ind);
    //Update the values
    var rowData = {
      index: ind,
      text: $("#tc-" + ind).text(),
      parent: $("#tc-" + ind).data("parent")
    };
    tableData.push(rowData)
  })
   

    // Send the data to the server
    fetch('http://localhost:5000/saveData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tableData)
    
    
  });
}


$("#Commit").off().on('click',function() {
readData();
});

function loadData() {
  fetch('http://localhost:5000/loadData')
      .then(response => {
          return response.json();
      })
      .then(data => {
          console.log('Data loaded:', JSON.stringify(data));
          var jsonData= data;
          $.each(jsonData, function(index, item) {
            
            var row = $("<tr id='row-" + item.index + "'>");
            rowCount=rowCount>item.index?rowCount:item.index;
           
            
            //row.data("parent", item.parent);
            var td = $("<td id='tc-" + item.index + "'>" + item.text + "</td>");
            row.append(td);
            //Inserts test 
            insertTestCase($("#insertTest"),item.index,item.text,null);
            /* Checks the parent thing idk
            if (item.parent) {
                console.log("check2");
              $("#" + item.parent).after(row);
            } else {
                console.log("check3");
                insert(row);
              //$("#table-body").append(row);
            }
              */
          });
          rowCount++;
          // Process and display the loaded data in the table here
      })
      .catch(error => {
          console.error('Error loading data:', error);
      });
}


$("#Load").off().on('click',function() {
  loadData();
});

function getNum(data){
    let matches = data.match(/(\d+)/);
    return matches[0]
}

/*function edit(td) {
    var Input = document.createElement('Input');
    Input.type = 'text';
    Input.value = td.textContent;
    td.innerHTML = '';
    td.appendChild(Input);
    Input.focus();
    Input.onkeydown = function (event) {
        if (event.key === 'Enter') {
            td.innerHTML = Input.value;
            
        }
    };
};

function select(td) {

     $("td").removeClass("selected");
     $(td).addClass("selected");
//copy-passted the 3 lines below from edit function

    var Input = document.createElement('Input');
    Input.type = 'text';
    Input.value = td.textContent;
    
    var tr=$(td).closest("tr");
    console.log(tr);
    
    $(document).on("keydown", function (event) {
        if (event.key === 'Delete') {
            var row = $(td).closest("[id^='row-']");
            
            var rowIndex = parseInt(row.attr('id').replace('row-', ''));
            console.log(rowIndex);
            row.remove();
            frontCount--; // decrement front count
            $("[id^='row-']").each(function (index) {
                var newRowId = 'row-' + (
                    index + 1
                );
                $(this).attr('id', newRowId);
                $(this)
                    .find('td:first-child')
                    .text(index + 1);
            });
        } else if (event.key === 'Tab') {
            var testCaseId = td.id;
            if (!tabStatus[testCaseId]) {
                console.log(td);
                td.innerHTML = "<button onclick='dropdown(" + td.id + ")'></button><b>" + Input.value + "</b>";
                
                var row = $(td).closest("[id^='row-']");
                
                var testLogs = row.find("[id^='tl-']");
                testLogs.each(function () {
                    var idParts = this
                        .id
                        .split('-');
                    var rowIndex = idParts[1];
                    var columnIndex = idParts[2];
                    $(this).html(
                        "<td id='tl-" + rowIndex + "-" + columnIndex + "'> <progress radio-" +
                        rowIndex + "-" + columnIndex + "' value='32' max='100'></progress> </td>"
                    );
                });
                tabStatus[testCaseId] = true;
            }
        } else if (event.key === 'Tab' && event.shiftKey) {
            var testCaseId = td.id;
            if (tabStatus[testCaseId]) {
                td.innerHTML = Input.value;
                var row = $(td).closest("[id^='row-']");
                var testLogs = row.find("[id^='tl-']");
                testLogs.each(function () {
                    var idParts = this
                        .id
                        .split('-');
                    var rowIndex = idParts[1];
                    var columnIndex = idParts[2];
                    $(this).html(
                        "<td id='tl-" + rowIndex + "-" + columnIndex + "'> <Input type='radio' name='ra" +
                        "dio-" + rowIndex + "-" + columnIndex + "' value='pass'> Pass <Input type='radi" +
                        "o' name='radio-" + rowIndex + "-" + columnIndex + "' value='fail'> Fail <Input" +
                        " type='text' id='err-" + rowIndex + "-" + columnIndex + "' placeholder='Error " +
                        "Code (optional)'></td>"
                    );
                });
                delete tabStatus[testCaseId];
            }
        } 
 });
    
}
        
        */
       
});

return (
    <>
      <table id="test-table" ref={tableRef}>
        <thead id="table-head">
          <tr>
            <th>Test Case</th>
          </tr>
        </thead>
        <tbody id="test-body">
          <tr id="insertTest">
            
            <td><input type="text" id="newField" placeholder="Test Case" ref={newFieldRef} /></td>
          </tr>
        </tbody>
      </table>
      <div id="insCol">
        <button id="Commit">Commit</button>
        <button id="Load">Load</button>
      </div>
      
    </>
  );
}
export default Testui
