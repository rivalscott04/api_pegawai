const Letter = require('./letter/letter.model');
const LetterEmployee = require('./letter/letter_employee.model');
const LetterSignature = require('./letter/letter_signature.model');

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