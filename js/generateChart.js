
const reportChart = document.querySelector('.report__chart');
let myChart;

export const generateChart = (data) => {
    const incomeData = data.filter(item => item.type === 'income');
    const expensesData = data.filter(item => item.type === 'expenses');

    const chartLabel = [...new Set(data.map(item => item.date))];

    const reducedOperationsPerDate = (dataArray) =>
        chartLabel.reduce(
            (acc, date) => {
            const total = dataArray
            .filter(item => item.date === date)
            .reduce((acc, record) => acc + parseFloat(record.amount), 0);
            acc[0] += total;
            acc[1].push(acc[0]);
    
            return [acc[0], acc[1]];
        }, 
        [0, []]
        );

    const [accIncome, incomeAmount] = reducedOperationsPerDate(incomeData);
    const [accExpenses, expensesAmount] = reducedOperationsPerDate(expensesData);
    const balanceAmount = incomeAmount.map(
        (income, i) => income -     expensesAmount[i]
    );
    const canvasChart = document.createElement('canvas');
    clearChart();
    reportChart.append(canvasChart);

    const ctx = canvasChart.getContext('2d');

    if(myChart instanceof Chart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: chartLabel,
            datasets: [
                {
                    label: "Доходы", 
                    data: incomeAmount, 
                    borderWidth: 2, 
                    hidden: true
                },
                {
                    label: "Расходы", 
                    data: expensesAmount, 
                    borderWidth: 2, 
                    hidden: true
                },
                {
                    label: "Баланс", 
                    data: balanceAmount, 
                    borderWidth: 2, 
                    hidden: false
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginsAtZero: true
                }
            },
            responsive: true,
            plugins: {
                legend: {
                    position: top
                }
            }
        }
    });
}

export const clearChart = () => {
    reportChart.textContent = '';
}