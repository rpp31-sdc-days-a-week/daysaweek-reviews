module.exports = formatData = function(data) {
  data = data.rows[0];
  data.ratings = data.ratings.reduce((previousRow, currentRow) => {
    return previousRow = {...previousRow, ...currentRow.rating_counts};
  }, {});

  data.recommended = data.recommended.reduce((previousRow, currentRow) => {
    return previousRow = {...previousRow, ...currentRow.r_counts};
  }, {});

  data.characteristics = data.characteristics.reduce((previousRow, currentRow) => {
    return previousRow = {...previousRow, [currentRow.name]: {id: currentRow.id, value: currentRow.value}};
  }, {});

  return data;
};
