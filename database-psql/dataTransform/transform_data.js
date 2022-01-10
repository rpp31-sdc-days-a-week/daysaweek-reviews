module.exports = formatData = function(data) {
  data = data.rows[0];

  // transform ratings data
  data.ratings = data.ratings.reduce((previousRow, currentRow) => {
    return previousRow = {...previousRow, ...currentRow};
  }, {});

  for (let i = 1; i <= 5; i++) {
    if (data.ratings[i] === undefined) {
      data.ratings[i] = '0';
    }
  };

  // transform recommended data
  data.recommended = data.recommended.reduce((previousRow, currentRow) => {
    return previousRow = {...previousRow, ...currentRow};
  }, {});

  if (!data.recommended['true']) data.recommended['true'] = '0';
  if (!data.recommended['false']) data.recommended['false'] = '0';

  // transform characteristics data
 if (data.characteristics !== null) {
    data.characteristics = data.characteristics.reduce((previousRow, currentRow) => {
    return previousRow = {...previousRow, [currentRow.name]: {id: currentRow.id, value: currentRow.value}};
  }, {});
 } else {
   data.characteristics = {};
 }

  return data;
};
