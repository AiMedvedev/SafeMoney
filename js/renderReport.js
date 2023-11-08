import {reformatDate} from './reformatDate.js';

const reportOperationList = document.querySelector('.report__operation-list');
const operationTypes = {
    income: 'доходы',
    expanses: 'расходы'
}

export const renderReport = (data) => {
    const reportRows = data.map(({category, amount, description, date, type}) => {
        const reportRow = document.createElement('tr'); 
        reportRow.classList.add('report__row');
        reportRow.innerHTML = `
            <td class="report__cell">${category}</td>
            <td class="report__cell" style="text-align: right">${amount.toLocaleString()}&nbsp;₽</td>
            <td class="report__cell">${description}</td>
            <td class="report__cell">${reformatDate(date)}</td>
            <td class="report__cell">${operationTypes[type]}</td>
            <td class="report__action-cell">
                  <button
                    class="report__button report__button_table">&#10006;</button>
                </td>
        `;
        return reportRow;
    });

    reportOperationList.textContent = '';
    reportOperationList.append(...reportRows);
}