
    /*
    Rewrite only for test cases
    Store in its own JSON file 
    basis of indents by child insertion (current code viability)
    try using parent node basis

    bugs : 
    post editing : making parent, create child, select parent-select child directly removes button
    unmaking parent -  data-parent becomes null, not parents data-parent

    Complete by 21st 
    */
    import { Routes, Route, NavLink, useNavigate, useLocation } from "react-router-dom";
    import React, { useEffect, useRef, useState } from 'react';
    import $, { post } from 'jquery';
    import 'jquery-ui/ui/widgets/button'; // Import specific jQuery UI components as needed
    import './testui.css';
    import { useParams } from 'react-router-dom';
    import Legend from "./Legend";
    import Navbar2 from "./Navbar2";
    import Status from "./Status";
    //const baseUrl = process.env.REACT_APP_API_BASE_URL;
    import fetchConfig from './Config';
  //const socket = io('http://192.168.250.90:5000');


    const Testui = () => {
      const [Phase, setPhase] = useState(true);
      
      const [active_users, setActiveUsers] = useState([]);
      const navigate=useNavigate();
      let pollingIntervalId=null;
      let lastKnownModified = null;
      const [isTimeoutActive, setIsTimeoutActive] = useState(true);

      const poll_switch = useRef(false);
      const hasInitialized = useRef(false);
      const tableRef = useRef(null);
      const newFieldRef = useRef(null);
      var rowCount=1;
      const { file } = useParams();
      const { jfile } = useParams(); // Extract the file name from the URL
      const [data, setData] = useState(null);
      var columnIndex = 1;
      var editing=true;
      const [hideLegend, setHideLegend] = useState(false);



      useEffect(() => {
        
        const fetchData = async () => {
          const config = await fetchConfig();
          try {
            const response = await fetch(`${config.backend_url}/folder/${file}/testpad/${jfile}`);
            const result = await response.text();
            setData(result);
            console.log(data);
          } catch (error) {
            console.error('Error fetching data:', error);
          }






        };
        fetchData();

        
        let clickTimeout = null;
        var editInuput;
      
        var flagSelectCalls=false;
        function editTestCase(td) {
          var timer;
          td.onclick = function () {
              console.log("CLicked!");
              if (timer) 
                  clearTimeout(timer);
              timer = setTimeout(function () {
                  select(td);
              }, 10);
          }
      
          td.ondblclick = function () {
              console.log("Double Click");
              clearTimeout(timer);
              edit(td);
          }
      }
      function insertTestCase(td, id, val, parent) {
        console.log(td, id, val, parent);
        var newRow = $("<tr>")
            .attr("id", "row-" + id)
            .attr("data-parent", parent);
        const newCell = $("<td>")
            .attr("id", "tc-" + id)
            .text(val);
            newCell.addClass("sticky");
        newRow.append(newCell);
        colorRow(newRow,0);
        indentSpace(newRow,1);
        td.before(newRow);
      
      
        // Attach the editTestCase event handlers
          
        newCell.each(function () {
            editTestCase(this);
            setTime(this,"");
        });
        if(val===""){edit(newCell[0]);}
        
    }
    $("#newField").keypress(function (event) {
      $("tr").removeClass("selected");
        if (event.key === 'Enter' && $("#newField").val() != "") {
            console.log("rowc2:", rowCount);
            insertTestCase($("#insertTest"), rowCount, $("#newField").val(), '0'); // enter key pressed
            rowCount++;
            $("#newField").val('');
        }
    });
      
      function insertButton(td) {
        
        var parent = td.parentNode;
        var isParent = parent.classList.contains('parent');
      
        // Only insert button if it's a parent row
        if (isParent) {
          const parentId = parent.id.replace('row-', '');
          const button = $("<button class='drop'>")
            .attr("id", parentId)
            .text("\u25BE")
            .on('click', function() {
              toggleButton(this);
            });
      
          $(td).prepend(button);
        }
      }
      
    
      // Modified edit function to use insertButton
      function edit(td) {
        if(editing)
          {
        $("tr").removeClass("selected");
        if (!td || !td.parentNode)
            return;
    
        var parent = td.parentNode;
        var button = parent.querySelector('button');
        var isParent = parent.classList.contains('parent');
    
        if (isParent) {
          if(button){// Store the button HTML in a variable
            button.parentNode.removeChild(button);
        }
        else {
          insertButton(td);
          return;
        }
      }
        

        var input = document.createElement('input');
        input.type = 'text';
        input.value = td.textContent.trim();
        td.innerHTML = '';
        
        var space='\u0009';
        td.append(space.repeat(findIndent($(parent))));

        td.appendChild(input);
        input.focus();
    
        input.onkeydown = function (event) {
            if (event.key === 'Enter' && input.value) {
                td.innerHTML = input.value;
                input.blur();
                indentSpace($(td.parentNode),1);
                if (isParent) {
                    // Insert the button after editing completes
                    insertButton(td);
                }
                if(input.value===""){
                  deleteTestCase($(td).closest('tr'))
              }
            }
        };
        //
          $(document).on('click.edit', function (event) {
              if (!$(event.target).closest('tr').is(parent)) {
                  // Clicked outside the edited row
                  td.innerHTML = input.value;// Commenting this Creates a bug where editing a parent then clicking on another parent's gives it an extra button
                  input.blur();
                  indentSpace($(td.parentNode),1);
                  if (isParent) {
                      // Insert the button after editing completes
                      insertButton(td);
                  }
                  if(input.value===""){
                    deleteTestCase($(td).closest('tr'))
                }
                $(document).off('click.edit');
              }
              
          });
              setTime(td,"");
        }
      }
      
      
      function select(td) {

        var row = $(td).closest("tr");
        $("tr").removeClass("selected");
        row.addClass("selected");
        if(row.hasClass("parent")&& row.find('button').length === 0)
        { edit(td); }

        $(document).off('keydown').on("keydown", function(event) {
            console.log(event.key);
          if(editing){
          if (event.key === "Tab"  && !event.shiftKey) {
            
            makeParent(row);
          } else if (event.key === "Tab" && event.shiftKey) {
            
            unmakeParent(row);
          } else if (event.key === "Enter") {
            insert(row); // default value for val
          } else if (event.key === "Delete") {
            
            deleteTestCase(row);
          }
          
          //If we want arrow key select Chat gpt functions
          else if (event.key === "ArrowUp") {
            event.preventDefault();
            navigateUp(row);
          } else if (event.key === "ArrowDown") {
            event.preventDefault();
            navigateDown(row);
          }
          else if(event.key==="Escape")
          {
            
            if(row.find("td:first").find("button")[0])
            toggleButton(row.find("td:first").find("button")[0]);           
          }
          
        }
        else
        {
          if (event.key === "Enter")
          {
            var newTd=row.next().find('td');
            select(newTd);
          }
        }
        });
        
      };
      
    
    
      // Unmake parent and shift children back to siblings
     
    function unmakeParent(row) {
      if (row.hasClass("parent")) {
                   
          var button = row.find("td:first").find("button");
      
          // Check if the button exists and has the right arrow Unicode character
          if (button.length && button.text() === '\u25B8') {
              toggleButton(button[0]);
              console.log("Button toggled");
          }
          // Select all children of the current parent row
          updateChildColorAndIndent(row);
          updateChild(row);
          
          row.removeClass('parent');
          button.remove();
      }
    }

    function updateChild(row)
    {
      //console.log(row);
      var parentId = row.attr('id').replace('row-', '');
      var children = $('[data-parent="' + parentId + '"]');

      // Loop through each child and update its data-parent attribute
      children.each(function () {
        var child = $(this);
        var newParent = row.data("parent");
        // Clear cached data
        child.removeData('parent');
        // Update both data and attr to ensure consistency
        child.data('parent', newParent);
        child.attr('data-parent', newParent); 
      });
    }
function updateChildColorAndIndent(row)
    {
      console.log("upcolor",row);
      var parentId = row.attr('id').replace('row-', '');
      var children = $('[data-parent="' + parentId + '"]');
      
      // Loop through each child and update its data-parent attribute
      children.each(function () {

        var child = $(this);
        console.log(child);
        if(child.hasClass("parent"))
          updateChildColorAndIndent(child);
        colorRow(child,1);
        indentSpace(child,0);
      });
    }


    function insert(row) {
      console.log("Enter row found");
      if (row.hasClass("selected")) {
        var button = row.find("td:first").find("button"); // Find the button element inside the first td element
        console.log("button closed", button.text());
        console.log("")
        var parent = (row.hasClass("parent") && button.text() === '\u25BE')? row.attr("id").replace("row-", "") : row.data("parent");
        var place = button.text() === '\u25B8' ? $('#row-' + collectDescendants(row.attr("id").replace("row-", ""), []).at(-1)).next() : row.next();
    
        console.log("place id:", place.attr("id"))
        console.log((row.td));
        insertTestCase(place, rowCount++, "", parent);
        console.log("INsert finished!");        
        var newTd = place.prev().find('td');
        select(newTd);
        console.log("select finished!");
      }
    }
      
      // Delete test case (Delete)
      function deleteTestCase(row) {
          if (row.hasClass("parent")) {
              unmakeParent(row);
          }
          var newTd=row.prev().find('td:first');
          //if (!newTd) newTd=row.next().find('td'); Deleteing first row makes auto select-delte disappear
      row.remove();
      select(newTd);
    
      }
      //Doesnt do anything
      $('[id^="tc-"]').each(function() {
        console.log("I am running");
        if ($(this).text().trim() === "") {
          console.log("Im going through every tc=",this.id);
            deleteTestCase($(this).closest('tr'));
        }
    });
    
      
      /*
      const tableObserver = new MutationObserver(function (mutations) {
        
      
      });
      tableObserver.observe(document.getElementById('test-table'), {
          childList: true,
          subtree: true
      });
      */


      
      
      
        function collectDescendants(parentId, children) {
          $('[data-parent="' + parentId + '"]').each(function () {
            children.push(this.id.match(/\d+/)[0]); // push only the digit to the children
            collectDescendants(this.id.match(/\d+/)[0], children);
          });
          return children;
        }
        
        
        function toggleButton(button) {
          console.log("button " + button.id + " clicked");
          let isOpen = button.textContent === "\u25BE";
          console.log(button.id + " status: " + isOpen);
          let parentId = $(button).closest('tr').attr('id').match(/\d+/)[0]; // get the digit from the row id
          let children =collectDescendants(button.id, []);
          console.log(children);
        
          if (isOpen) {
            button.textContent = "\u25B8";
            console.log(button.id + " closed " + button.textContent);
            $.each(children, function (index, elementId) {
              $('#row-' + elementId).hide();
            });
          } else {
            button.textContent = "\u25BE";
            console.log(button.id + " opened " + button.textContent);
            $.each(children, function (index, elementId) {
              $('#row-' + elementId).show();
        });
        }
        }
      
      const buttons = document.querySelectorAll(`button[id^="[\\d]"]`);
      
      buttons.forEach(button => {
          button.addEventListener('click', event => toggleButton(event.target));
      });
      
      async function readData() {
        var tableData = [];
        $("[id^='row-']").each(function (index) {
            index++;
            var ind = getNum(this.id);
            rowCount = rowCount > ind ? rowCount : ind;

            var textContent = $("#tc-" + ind).clone().children().remove().end().text();
            if(textContent.trim()!=""){
            var rowData = {
                index: ind,
                text: textContent.trim(),                // Trim to remove leading/trailing whitespace
                parent: $("#row-" + ind).data("parent"),
                meta: $("#tc-" + ind).data("meta")
            };
            tableData.push(rowData);
          }
        });
    
    
        const config = await fetchConfig();
        
            // Send the data to the server
            fetch(`${config.backend_url}/folder/${file}/testpad/${jfile}/saveData`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(tableData)
            
            
          });
        }
        
        
        $("#Commit").off().on('click',function() {
          // eslint-disable-next-line no-restricted-globals
          if(confirm("Are you sure you want to Commit?")){
          if(editing)
            readData();
          else
            readLogs();
          }
        });
        
        
        async function loadData() {
          const config = await fetchConfig();
          fetch(`${config.backend_url}/folder/${file}/testpad/${jfile}/loadData`)
            .then(response => {
              return response.json();
            })
            .then(data => {
              

              console.log('Data loaded:', JSON.stringify(data));
              
              var jsonData = data;
              $.each(jsonData, function(index, item) {
                var row = $("<tr id='row-" + item.index + "'>");
                
                rowCount = rowCount > parseInt(item.index, 10) ? rowCount : item.index;
                console.log("ROWOWOWOWCOUNT=",rowCount);
                var td = $("<td id='tc-" + item.index + "'>" + item.text + "</td>");
                row.append(td);
        
                if (item.parent != 0) {
                  makeParent($("#" + "row-" + item.parent));
                }
        
                insertTestCase($("#insertTest"), item.index, item.text, item.parent);
                  setTime($('#tc-'+item.index),item.meta);
              });
              rowCount++;
              
              
            })
            .catch(error => {
              console.error('Error loading data:', error);
            });
        }
        
        /*
        $("#Load").off().on('click',function() {
          loadData();
        });
      */
        if(!hasInitialized.current){
          loadData();
          pollForUpdates();
        hasInitialized.current = true;
        }
      
      function getNum(data) {
          let matches = data.match(/(\d+)/);
          return matches[0]
      }

      // Make as parent (Tab)
      function makeParent(row) {
        if (!row.hasClass("parent")) {
        row.removeClass("selected");
          row.addClass("parent");
          if(row.attr('id'))
          var parentId = row.attr('id').replace('row-', '');
          const button = $("<button class='drop'>")
            .attr("id", parentId)
            .text("\u25BE")
            .on('click', function() {
              toggleButton(this);
            });
          row.addClass("selected");
          row.find("td:first").prepend(button);
          
        }
        
      }

        function setTime(td,meta) {
            if(meta===""){
            var user=token.user_name;
            var timestamp = new Date().toLocaleString();
            $(td).attr('data-meta', user + '-' + timestamp);
        }
            else
                $(td).attr('data-meta', meta);
        }
          

      function colorRow(tr,flag)
      {
        var row=tr;
        var indent=findIndent(tr)
        console.log("indent:",indent);
        if(flag===1)
          indent--;
        //Blue light to solid
        var gshade = 204 - (indent * 27);
        var rshade = 153 - (indent * 51);
        console.log("Chck1");
        row.css('backgroundColor',`rgb(${rshade},${gshade},255)`); // set the background color
        row.find("td").css('backgroundColor',`rgb(${rshade},${gshade},255)`);
        //Green light to Solid
        //var shade = 204 - (indent * 51); 
        //row.css('backgroundColor',`rgb(${shade},255,${shade})`); // set the background color

        //Green solid to light
        //var shade = 0 + (indent * 51); 
        //row.css('backgroundColor',`rgb(${shade},255,${shade})`); // set the background color

        //Rainbow colours
        //var colorarray=["#FF6666","#FFB266","#FFFF66","#B2FF66","#66FF66","#66FFB2","#66FFFF","#66B2FF","#6666FF","#B266FF","#FF66FF","#FF66B2"];
        //row.css('backgroundColor',colorarray[indent]); // set the background color
      }

      function indentSpace(tr,flag){
        const parentId = tr.attr('id').replace('row-', '');

        const button = $("<button class='drop'>")
            .attr("id", parentId)
            .text("\u25BE")
            .on('click', function() {
              toggleButton(this);
            });

        var indent=findIndent(tr)
        var row=tr;
        if(flag===1)
        row.find('td:first').text('\u0009'.repeat(indent) + row.find('td:first').text());
        else
        {
        row.find('td:first').text('\u0009'.repeat(findIndent(row)-1) + row.find('td:first').text().replace('\u25BE','').trim());
        if(row.hasClass("parent"))
        row.find("td:first").prepend(button);
        }
      }


      function findIndent(tr) {
        var indent = 0;
        var row=tr;
        console.log($(tr).id);
        while (tr.attr('data-parent')!= 0) {
          indent += 1;
          tr = $("#row-" + tr.data('parent'));
        }     
        return indent;  
      }
      
      
      //If we ever Want Arrow Key select options
      //1 bug associated - Enter then make empty => requires click somwhere to delete it

      function navigateUp(currentRow) {
        var prevRow = findPreviousRow(currentRow);
        if (prevRow.length > 0) {
            $("tr").removeClass("selected");
            prevRow.addClass("selected");
            $(document).off('keydown');
            select(prevRow.find("td")[0]);
        }
    }
    
    function navigateDown(currentRow) {
        var nextRow = findNextRow(currentRow);
        if (nextRow.length > 0) {
            $("tr").removeClass("selected");
            nextRow.addClass("selected");
            $(document).off('keydown');
            select(nextRow.find("td")[0]);
        }
    }

    function findPreviousRow(currentRow) {
      var prevRow = currentRow.prevAll(":not(#insertTest)").first();
      while (prevRow.length > 0 && prevRow.is(":hidden")) {
          prevRow = prevRow.prevAll(":not(#insertTest)").first();
      }
      return prevRow;
  }

  function findNextRow(currentRow) {
      var nextRow = currentRow.nextAll(":not(#insertTest)").first();
      while (nextRow.length > 0 && nextRow.is(":hidden")) {
          nextRow = nextRow.nextAll(":not(#insertTest)").first();
      }
      return nextRow;
  }


  //Test Logs Section


  

  $("#insertTestLog").off('click').on('click',function () {
    var timestamp = new Date().toLocaleString();
    if (!editing) {
      
        insertTestLogs(columnIndex, timestamp, [], [],token.user_name);
        columnIndex++;
        readLogs(); //Auto commit when it inserts a log;
    }
});

function insertTestLogs(col, timestamp, values, errorCodes,user_name) {
  console.log("called for Log");
  $("#table-head tr:first th:nth-child(1)").after(
      "<th id='tl-" + col + "'>Test Log " + col + " - " + timestamp +" - "+ user_name + "</th>"
  );
  $("[id^='row-']").each(function (index, element) {
      let rowIndex = $(element)
          .attr('id')
          .replace('row-', '');
      if ($(element).hasClass('parent')) {
          $(element)
              .find("td:first")
              .after(
                  "<td id='col-" + col + "'><progress id='prog-" + rowIndex + "-" + col + "' valu" +
                  "e='0' max='100'> Progress </progress>  </td>"
              );
      } else {
          $(element)
              .find("td:first")
              .after(
                  "<td id='col-" + col + "'><input type='radio' name='radio-" + rowIndex + "-" +
                  col + "' value='pass'> Pass <input type='radio' name='radio-" + rowIndex + "-" +
                  col + "' value='fail'> Fail <input id = 'err-" + rowIndex + "-" + col + "'type=" +
                  "'text'  style='display: none' value='' placeholder='Error Code (optional)'></td>"
              );
      }
      console.log(values[index], errorCodes[index]);
      if (values[index]) {
          const value = values[index];
          if (/^(\d+(?:\.\d+)?)/.test(value)) { // progress value (number)
              $(`#prog-${rowIndex}-${col}`).val(value);
              console.log("progress added");
          } else { // radio value (pass/fail)
              //$(`input[name="radio-${rowIndex}-${col}"][value="${value}"]`).prop('checked', true);
              $(`input[name="radio-${rowIndex}-${col}"][value="${value}"]`).prop(
                  'checked',
                  true
              );
              console.log("Radio added");
          }
      }
      if (errorCodes[index]) {
          $(`#err-${rowIndex}-${col}`).val(errorCodes[index]);
      }
  });
  initRadios();
}



async function initRadios() {
  const config = await fetchConfig();
  if (!editing) {
      var radios = document.querySelectorAll('[name^="radio-"]');
      Array.from(radios).forEach(function (radio) {
          var td = radio.parentNode;
          var idParts = $(radio).attr('name').split('-');
          var rowNumber = idParts[1];
          var colNumber = idParts[2];
          var errId = 'err-' + rowNumber + '-' + colNumber;
          

          if (radio.checked) {
              if (radio.value === 'pass') {
                  td.style.backgroundColor = 'lightgreen'; // Pass: light green
                  //$('#' + errId).hide(); for now, they want to be able to have evidence in the event of pass
                  $('#' + errId).show();
              } else if (radio.value === 'fail') {
                  td.style.backgroundColor = 'lightcoral'; // Fail: light coral
                  $('#' + errId).show();
              }

              
          
          }

          radio.addEventListener('click', function () {
            
              if (radio.value === 'pass') {
                  td.style.backgroundColor = 'lightgreen'; // Pass: light green
                  //$('#' + errId).hide(); for now, they want to be able to have evidence in the event of pass
                  $('#' + errId).show();
              } else if (radio.value === 'fail') {
                  td.style.backgroundColor = 'lightcoral'; // Fail: light coral
                  $('#' + errId).show();
              }
             
              updateProgress(td);

              

              //Single Fetch per check to update 
              var error=$('#'+errId).val();
              console.log("HEYY:",rowNumber,colNumber,radio.value,error);
              var radioData=[];
              radioData.push({rowlog:rowNumber,testlog:colNumber,radio:radio.value,err:error});
              
              
              fetch(`${config.backend_url}/folder/${file}/testpad/${jfile}/updateRadio`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(radioData)
              });
              
              console.log('Sent');

          });
      });
  }
}



  $('[name^="radio-"]').click(function () {
    initRadios();
  });


  function updateProgress(td) {
    console.log("Updating progress for column...");
    var colIndex = $(td).index(); // Get the column index
    console.log("Column index: " + colIndex);
    var progressValue ;

    // Find the progress elements in the same column
    var progressElements = $(td).closest('table').find(`tr td:nth-child(${colIndex + 1}) progress`);
    if (progressElements.length === 0) {
        console.log("No progress element found for this column.");
        return;
    }
    console.log("Progress elements found: ", progressElements.map(function() { return this.id }).get());

    function collectDescendants(parentId, children) {
        console.log("Collecting descendants for parentId: " + parentId);
        $('[data-parent="' + parentId + '"]').each(function () {
            var childId = $(this).attr('id').replace("row-", "");
            children.push(childId); // push only the row id to the children
            console.log("Collected descendant: " + childId);
            collectDescendants(childId, children); // recursive call to collect further descendants
        });
    }

  progressElements.each(function() {
        var parentId = $(this).closest('tr').attr('id').replace("row-", "");
        var children = [];
        console.log("ID being collected : ", parentId);
        collectDescendants(parentId, children);
        progressValue = calcCol(children, colIndex);
            $(this).attr("value", progressValue);
            if(progressValue===100) {
              this.parentNode.style.backgroundColor = 'lightgreen';
            }
            else {
              this.parentNode.style.backgroundColor= this.parentNode.parentNode.style.backgroundColor
            }
    console.log("Is"+$(this).id+"showing progress"+progressValue);
        });
        console.log("Progress value updated to: " + progressValue);

  }

  function calcCol(children, colIndex) {
    var succ = 0;
    var total = 0;

    console.log("Calculating progress for children: " + children);

    if (children.length === 0) {
        console.log("No children found.");
    }

    $.each(children, function (index, childId) {
        var $child = $("#row-" + childId);
        var $td = $child.find('td').eq(colIndex);
        console.log("Checking child row: " + childId);
        $td.find('input[type="radio"]').each(function () {
            if ($(this).is(':checked')) {
                console.log("Radio button checked: " + $(this).val());
                if ($(this).val() === 'pass') {
                    succ++;
                }
                total++;
            }
        });
    });

    if (total === 0) {
        console.log("No radio buttons selected in this column.");
        return 0;
    }
    var progress = (succ * 100) / total;
    console.log("Calculated progress: " + progress);
    return progress;
  }

  // Call updateProgress initially to set the progress value
  $("[id^='row-']").each(function () {
    var progressElements = $(this).find("progress");
    if (progressElements.length) {
        updateProgress($(this).find("td").get(1)); // Update progress for the second column
    }
  });

  async function readLogs() {
    const config = await fetchConfig();
    var testData = [];
    $("th[id^='tl-']").each(function () {
        var colIndex = $(this)
            .attr('id')
            .replace('tl-', '');
        const rowData = {
            testLog: colIndex,
            timestamp: (
                $("#tl-"+colIndex).text().split(' - ')[1]
            ), // default timestamp, you can modify this
            user: (
              $("#tl-"+colIndex).text().split(' - ')[2]
          ), // default user, you can modify this
            hospital: "", // default hospital, you can modify this
            data: []
        };
        $("[id^='row-']").each(function () {
            var rowIndex = $(this)
                .attr('id')
                .replace('row-', '');
            const $progress = $(document).find(
                `progress[id^="prog-${rowIndex}-${colIndex}"]`
            );
            const $radioButtons = $(document).find(
                `input[type="radio"][name^="radio-${rowIndex}-${colIndex}"]`
            );
            const $errorCodeInput = $(document).find(
              `input[type="text"][id^="err-${rowIndex}-${colIndex}"]`
          );

            const radioButtonValue = $radioButtons
                .filter(":checked")
                .val();
            let value = "";
            let errorCode = "";

            if ($progress.length) {
                value = $progress.attr("value");
            } else if (radioButtonValue) {
                value = radioButtonValue;
            } else {
                value = null;
            }
            errorCode = $errorCodeInput.val();
            

            rowData
                .data
                .push({row: rowIndex, value: value, errorCode: errorCode});
        });
        testData.unshift(rowData); // Move this line outside the inner loop
    });
    fetch(`${config.backend_url}/folder/${file}/testpad/${jfile}/saveLogData`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
}

async function loadLogs() {
  const config = await fetchConfig();
  //var testData = jsoninitData;
  console.log("Fetch Logs!");
  fetch(`${config.backend_url}/folder/${file}/testpad/${jfile}/loadLogData`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  })
  .then(response => {
    return response.json();
  })
  .then(data => {

    var testData=data;
  $.each(testData, function (index, col) {
      var values = [];
      var errors = [];
      $.each(testData[index].data, function (index, item) {
          values.push(item.value);
          errors.push(item.errorCode);
      });
      console.log(values, errors);

      insertTestLogs(col.testLog, col.timestamp, values, errors,col.user);
      columnIndex=parseInt(col.testLog,10)+1;
  });

})
.catch(error => {
  console.error('Errorsss loading data:', error);
});

}

$("#switchToLog").off('click').on('click',function () {
  setHideLegend(true);
  console.log(hideLegend);
  console.log("switching to Log");
  // eslint-disable-next-line no-restricted-globals
  if(confirm("Are you sure, By Switching to Logs, You will Commit the Case data and be unable to edit it!")) {
    editing=false;
    
    $('#insertTest').hide();
    $('#switchToLog').hide();
    $('#insertTestLog').show();
    $('#Load').show();
    readData();
    
    loadLogs();

    //Swtiching phase of the user
    setPhase(false);
    fetchActiveUsers(Phase);

    stopPolling();
    toggleTimeout(); //prevents insertTestlog for some reason
    fetchActiveUsers(Phase);
  }
});





//Concurrency fixes

//1.Time out feature
const handleUserActivity = () => {
  resetIdleTimeout();
};

// Add event listeners to reset the timeout on user activity
window.addEventListener('mousemove', handleUserActivity);
window.addEventListener('keydown', handleUserActivity);



// Set the initial timeout
resetIdleTimeout();

// Cleanup on unmount
return () => {
  if (idleTimeoutRef.current) {
    clearTimeout(idleTimeoutRef.current);
  }
  window.removeEventListener('mousemove', handleUserActivity);
  window.removeEventListener('keydown', handleUserActivity);

  //stopPolling();
};

//2. POLLLING FOR UPDATES - PROBLEM WITH TEST LOGS


async function pollForUpdates() {
  const config = await fetchConfig();
  pollingIntervalId = setInterval(() => {
    fetch(`${config.backend_url}/folder/${file}/testpad/${jfile}/get-last-modified`)
      .then(response => response.json())
      .then(data => {
        if (!lastKnownModified || new Date(data.lastModified) > new Date(lastKnownModified)) {
          lastKnownModified = data.lastModified;
          if(poll_switch.current){
          clearTable();
          loadData();
          }
          poll_switch.current=true;
        }
      });
  }, 5000); // Poll every 5 seconds
}

function stopPolling() {
  if (pollingIntervalId) {
    clearInterval(pollingIntervalId);
    pollingIntervalId = null;
  }
}


function clearTable() {
  if(document.getElementById('test-body')){
  var tableBody = document.getElementById('test-body');
  var rows = tableBody.querySelectorAll('tr');
  // Preserve the last row
  for (let i = 0; i < rows.length - 1; i++) {
    tableBody.removeChild(rows[i]);
  }
}

}





    }, [jfile]);

    


    const idleTimeoutRef = useRef(null);
    const IDLE_TIMEOUT = 300000; // 5 minutes in milliseconds
    

    const toggleTimeout = () => {
      setIsTimeoutActive(!isTimeoutActive);
      if (!isTimeoutActive) {
        resetIdleTimeout();
      } else if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
    };

   const resetIdleTimeout = () => {
    if (isTimeoutActive) {
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
      idleTimeoutRef.current = setTimeout(() => {
        removeToken();
      }, IDLE_TIMEOUT);
    }
  };

  const removeToken =  async (e) => {
    const config = await fetchConfig();
      alert("Session over");
      fetch(`${config.backend_url}/clear_User_status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({user:token.user_name}),
      });
      sessionStorage.removeItem('token')
      navigate('/login') 
    
  }


  //Checking for token
  
    function getToken()
    {
      const tokenString = sessionStorage.getItem('token')
      const userToken = JSON.parse(tokenString)
      return userToken
    }
    const token=getToken();
    if(!token){

      return(
      <div>
        <h1>Session Over, Login again</h1>
        <NavLink to='/login'>Login</NavLink>
      </div>
      );
    }
    function PhaseClash(activeusers)
    {
      
      console.log("Phase Clash called!");
      for(let i=0;i<activeusers.length;i++)
      {
        for(let j=0;j<activeusers.length;j++)
          if(activeusers[j].user===token.user_name)          
             var index=j;

        //Check if user's url is same as anyone else's url
        if(((activeusers[i].folder===activeusers[index].folder)&&(activeusers[i].file===activeusers[index].file))&&(activeusers[i].phase!=activeusers[index].phase))
          if(activeusers[index].phase===true)
              editing=false;
      }
      if(editing==false)
        $('#insertTest').hide();
      console.log("Editing33:",editing);
    }
    
    

    const fetchActiveUsers = async (Phase) => {
      
      try {
        const config = await fetchConfig();
        const response = await fetch(`${config.backend_url}/User_status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({phase:Phase,user:token.user_name, url: window.location.pathname }),
        });
        const result = await response.json();
        setActiveUsers(result);
        PhaseClash(result);
        
      } catch (error) {
        console.error('Error fetching active users:', error);
      }
    };
  //

    return (
        <>
        <body className="testui-body">
          <Navbar2 />
          <div className="flex">
          <div className="diagnol"><h3>{file}  &gt;  {jfile}</h3></div>
          <div className="status_bar"> <Status active_users={active_users} fetchActiveUsers={fetchActiveUsers} Phase={Phase} /></div>
          </div>
        <div className="flex">
               
        <div className="scrollable-container">
          <table id="test-table" ref={tableRef}>
          <thead id="table-head">
          <tr>
            <th id="testCase" class="sticky">Test Cases
            HTML{!hideLegend && <Legend />}
            </th>
          </tr>
        </thead>
        <tbody id="test-body">
          <tr id="insertTest">
            <td><input type="text" id="newField" placeholder="Test Case" ref={newFieldRef} /> </td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>

          </body>
          <footer id="insCol">
            <button id="Commit">Commit</button>
            <button id="switchToLog">Switch to Logs</button>
            <button id="insertTestLog">Insert Test Log</button>
          </footer>
          
        </>
      );
      
      
      
    }
    export default Testui
