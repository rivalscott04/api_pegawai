const Letter = require('./letter.model');
const LetterEmployee = require('./letter_employee.model');
const LetterSignature = require('./letter_signature.model');

// Definisikan relasi antar model
Letter.hasMany(LetterEmployee, { foreignKey: 'letter_id', as: 'employees' });
Letter.hasMany(LetterSignature, { foreignKey: 'letter_id', as: 'signatures' });
LetterEmployee.belongsTo(Letter, { foreignKey: 'letter_id' });
LetterSignature.belongsTo(Letter, { foreignKey: 'letter_id' });

module.exports = {
  Letter,
  LetterEmployee,
  LetterSignature,
}; 