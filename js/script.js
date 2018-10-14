var vars = {
  sortedObj: [],
  rows: [],
  max: 30,
  articleTitle: ""
}

function getData(){
  vars.sortedObj = [];
  vars.rows = [];
  $.ajax({
   url: 'https://en.wikipedia.org/w/api.php',
   data: { 
     action: 'query', 
     generator: 'random',
     indexpageids: 1,
     grnnamespace: 0,
     prop: 'extracts',
     origin: '*',
     format: 'json'
   },
   dataType: 'json',
   success: successCB
  });
}
function drawChart() {
  // Create the data table.
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'X');
  data.addColumn('number', 'Frequency Distribution');
  vars.sortedObj.forEach(function(entry,i) {
    let word = entry.word;
    let count = entry.count;
    if (i<vars.max) vars.rows.push([word,count]);
  });
  data.addRows(vars.rows);
  // Set chart options
  var options = {
    'title':'Distribution of Words on Wikipedia Article: ' + vars.articleTitle,
    'width':  "100%",
    'height': 500,
    
    vAxis: {
          title: 'Frequency',
          textStyle: {
            color: '#555',
            fontSize: 16,
            bold: true
          },
          titleTextStyle: {
            color: '#222',
            fontSize: 16,
            bold: true
          }
        },
    hAxis: {
          title: 'Words',
          textStyle: {
            color: 'black',
            fontSize: 11
          }
        },
  };

  var chart = new google.visualization.LineChart(document.getElementById('chart'));
  chart.draw(data, options);
}
function sortArr(arr) {
  var sortObj = [];
  arr.forEach(function(word){
    let hasEntry = false;
    sortObj.forEach(function(entry){
      if (word.toLowerCase() == entry.word.toLowerCase()){
        entry.count++;
        hasEntry = true;
      }
    });
    if (!hasEntry) sortObj.push({word: word, count: 1});
  });
  sortObj.sort(function(a,b){
    return parseFloat(b.count) - parseFloat(a.count)
  })
  return sortObj
}
function strip(html) {
  var tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
 }
function successCB(x) {
  const id = x.query.pageids[0];
  const html = x.query.pages[id].extract;
  vars.articleTitle = x.query.pages[id].title;
  const text = strip(html);
  var nopunc = text.replace(/["'.,\/#!$%\^&\*;:{}=\-_`~()]/g," ");
  var finalStr = nopunc.replace(/\s{2,}/g," ");
  var arr = finalStr.split(' ');
  $("#target").text(text);
  vars.sortedObj = sortArr(arr);
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChart);
}

getData();
$("#fetch").click(getData);
$(".text-toggle").click(function(){
        $("#target").toggle();
});


  
  
