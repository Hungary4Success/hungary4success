import fs from 'fs';
// import ssh from 'ssh2';

export default function getMarks(username, password) {
  fs.readFile('test.txt', (err, data) => {
    if (err) return console.log(err);

    parseMarks(data.toString(), 'mbaxaag2');
  });

  // const Client = ssh.Client;

  // const conn = new Client();
  // conn.on('ready', function () {
  //   const startCommand = 'java -classpath /opt/teaching/lib/ARCADE TClient';

  //   let isConnected = false;
  //   let startListening = false;
  //   let responseString = '';
  //   conn.exec(startCommand, function (err, stream) {
  //     if (err) throw err;

  //     console.log('Connecting to Arcade...');

  //     stream.on('close', function (code, signal) {
  //       parseMarks(responseString);
  //       conn.end();
  //     }).on('data', function (data) {
  //       if (!isConnected && data.toString() === 'Initialisation completed') {
  //         console.log('Arcade: Succesfully connected.');
  //         isConnected = true;
  //       }

  //       if (isConnected && data.toString().includes('Running query')) {
  //         console.log('Arcade: Query sent.');
  //         startListening = true;
  //       }

  //       if (startListening) {
  //         responseString += data.toString();
  //       }
  //     }).stderr.on('data', function (data) {
  //       console.log('SSH Error: ' + data);
  //     });

  //     stream.end('c\n+\n2\nq\nq\nr\nx\n');
  //   });
  // }).connect({
  //   host: 'kilburn.cs.manchester.ac.uk',
  //   port: 22,
  //   username: username,
  //   password: password
  // });
}

function parseMarks(inputString, username) {
  const marksData = {
    years: []
  };

  const databaseRegex = /Database ([0-9]{2})-([0-9]{2})-([0-9])(X?)/g;
  let databaseMatch;
  while ((databaseMatch = databaseRegex.exec(inputString))) {
    if (databaseMatch[4] === 'X') continue;

    const currYear = {
      number: parseInt(databaseMatch[3], 10),
      schoolYear: [parseInt(databaseMatch[1], 10), parseInt(databaseMatch[2], 10)]
    };

    currYear.subjects = [];
    const tableRegex = /Table (([0-9]{3})(s([0-9]))?([a-zA-Z]?)(fin)?|[^:]*)/g;
    tableRegex.lastIndex = databaseMatch.index;

    let tableMatch;
    while ((tableMatch = tableRegex.exec(inputString))) {
      const currSubject = {
        id: tableMatch[1],
        name: subjectNames[tableMatch[2]] || null,
        subjectId: tableMatch[2] || null,
        semester: tableMatch[4] ? parseInt(tableMatch[4], 10) : null,
        type: subjectTypes[tableMatch[5]] || null,
        isFinal: tableMatch[6] === 'fin'
      };

      const weightings = parseRow('Weighting', inputString, tableMatch.index).map(x => parseInt(x, 10));
      const denominators = parseRow('Denominator', inputString, tableMatch.index).map(x => parseInt(x, 10));
      const names = parseRow('Email Name', inputString, tableMatch.index);
      const marks = parseRow(username, inputString, tableMatch.index);

      const sessions = [];
      for (let i = 0; i < names.length; i++) {
        const markRegex = /(?:\(?([0-9]+\.?[0-9]*)\+?\)?|-)([EL]{0,2})/;
        const markMatch = markRegex.exec(marks[i]);

        const markValue = !isNaN(markMatch[1]) ? parseFloat(markMatch[1]) : undefined;
        const isExpected = markMatch[2].includes('E');

        if (names[i] === 'Total') {
          currSubject.total = markValue || null;
          currSubject.isInProgress = isExpected;
          continue;
        }

        if (names[i] === 'Marked') {
          currSubject.marked = markValue || null;
          continue;
        }

        const currSession = {
          name: names[i],
          weighting: weightings[i],
          denominator: denominators[i],
          value: markValue || null,
          isEstimated: markMatch[0][0] === '(',
          isExpected,
          isLate: markMatch[2].includes('L')
        };

        sessions.push(currSession);
      }
      currSubject.sessions = sessions;

      // console.log(currSubject);
      currYear.subjects.push(currSubject);
    }

    marksData.years.push(currYear);
  }

  // console.log(JSON.stringify(marksData, null, 2));
}

function parseRow(rowTitle, searchString, startIndex) {
  const regex = new RegExp(`${rowTitle}.*\\|[^\\n]*`, 'g');
  regex.lastIndex = startIndex;
  const match = regex.exec(searchString);

  return match[0].split('|').filter((value, index) => value && index !== 0).map(x => x.trim());
}

const subjectTypes = {
  L: 'lab',
  E: 'examples',
  T: 'test',
  C: 'clinic',
  X: 'exam'
};

const subjectNames = {};
