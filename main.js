'use strict';

let bankTable = localStorage.getItem('banks'); // name localStorage table

let banksArr = []; // parsed array

const tableId = '#mainTable'; // <tbody> ID

const select = getQuery('select[name="select"]'); // input 'select'

function addNewBank() {
    let bank = getQuery('#addForm input[name="bankName"]').value;
    const rate = +getQuery('#addForm input[name="insertRate"]').value;
    const maxLoan = +getQuery('#addForm input[name="maxLoan"]').value;
    const minPay = +getQuery('#addForm input[name="minPay"]').value;
    const loanTerm = +getQuery('#addForm input[name="loanTerm"]').value;

    if(rate < 0 || rate > 100) return alert('Uncorrect rate');
    if(maxLoan < 0) return alert('Uncorrect maximum loan');
    if(minPay < 0 || minPay > 100) return alert('Change the minimal down payment');
    if(loanTerm < 0 || loanTerm > 360) return alert('Uncorrect the term, maximum 360 month');

    if(bank && rate && maxLoan && minPay && loanTerm){
        const newBank = {
            bankName: bank,
            insertRate: +rate,
            maxLoan: +maxLoan,
            minPay: +minPay,
            loanTerm: +loanTerm
        };

        banksArr.push(newBank);
        saveTable('Added');

        let stringBank = document.createElement('tr');
        const newId = +banksArr.length - 1;
        stringBank.id = 'bank' + newId;
        stringBank.innerHTML = `
            <td class="bankName">${bank}</td>
            <td class="insertRate">${rate}</td>
            <td class="maxLoan">${maxLoan}</td>
            <td class="minPay">${minPay}</td>
            <td class="loanTerm">${loanTerm}</td>
            <td><a href="#" onclick="editBank(${newId})">&#128397 </a>
            <a href="#" onclick="removeBank(${newId})"> &#10006</a></td>`;

        getQuery('#mainTable').insertBefore(stringBank, document.getElementById('addForm'));

        getQuery('#addForm input[name="bankName"]').value = '';
        getQuery('#addForm input[name="insertRate"]').value = '';
        getQuery('#addForm input[name="maxLoan"]').value = '';
        getQuery('#addForm input[name="minPay"]').value = '';
        getQuery('#addForm input[name="loanTerm"]').value = '';

    } else alert('empty cell')
}

function saveTable(text) {
    localStorage.setItem('banks', JSON.stringify(banksArr));
    alert(text);
}

function getQuery(css) {
    return document.querySelector(css);
}

function editBank(index) {
    let parent = getQuery('#bank'+index);
    parent.innerHTML = `
        <td><input type="text" name="bankName" value="${banksArr[index].bankName}" required></td>
        <td><input type="number" name="insertRate" value="${banksArr[index].insertRate}" min="1" max="100" required></td>
        <td><input type="number" name="maxLoan" value="${banksArr[index].maxLoan}" min="0" required></td>
        <td><input type="number" name="minPay" value="${banksArr[index].minPay}" min="1" max="100" required></td>
        <td><input type="number" name="loanTerm" value="${banksArr[index].loanTerm}" min="6" step="6" max="96" required></td>
        <td><input type="submit" value="OK" onclick="editSubmit(${index})"><input type="button" value="cancel" onclick="cancelEdit(${index})" ></td>   
    `;


}

function editSubmit(index) {
    event.preventDefault();
    console.log('here');

    banksArr[index].bankName = getQuery(`#bank${index} input[name="bankName"]`).value;
    banksArr[index].insertRate = +getQuery(`#bank${index} input[name="insertRate"]`).value;
    banksArr[index].maxLoan = +getQuery(`#bank${index} input[name="maxLoan"]`).value;
    banksArr[index].minPay = +getQuery(`#bank${index} input[name="minPay"]`).value;
    banksArr[index].loanTerm = +getQuery(`#bank${index} input[name="loanTerm"]`).value;

    saveTable('Edited');
    location.reload();
}

function cancelEdit(i) {
    getQuery('#bank' + i).innerHTML = `
            <td class="bankName">${banksArr[i].bankName}</td>
            <td class="insertRate">${banksArr[i].insertRate}</td>
            <td class="maxLoan">${banksArr[i].maxLoan}</td>
            <td class="minPay">${banksArr[i].minPay}</td>
            <td class="loanTerm">${banksArr[i].loanTerm}</td>
            <td><a href="#" onclick="editBank(${i})">&#128397 </a>
            <a href="#" onclick="removeBank(${i})"> &#10006</a></td>`;
}

function removeBank(index) {
    if(confirm("Do you want to remove?")){
        banksArr.splice(index, 1);
        saveTable('Ok, removed');
        location.reload();
    }
}

function firstStart() {
    banksArr = [
        {
            bankName: 'Alfabank',
            insertRate: 3,
            maxLoan: 500000,
            minPay: 20,
            loanTerm: 24
        },
        {
            bankName: 'Betabank',
            insertRate: 4,
            maxLoan: 400000,
            minPay: 10,
            loanTerm: 36
        },
        {
            bankName: 'Gammabank',
            insertRate: 5,
            maxLoan: 100000,
            minPay: 50,
            loanTerm: 36
        },
        {
            bankName: 'Deltabank',
            insertRate: 6,
            maxLoan: 200000,
            minPay: 30,
            loanTerm: 48
        }
    ];
    localStorage.setItem('banks', JSON.stringify(banksArr));

    bankTable = localStorage.getItem('banks');
}

function renderTable() {
    for(let i in banksArr){
        let stringBank = document.createElement('tr');
        stringBank.id = 'bank' + i;
        stringBank.innerHTML = `
            <td class="bankName">${banksArr[i].bankName}</td>
            <td class="insertRate">${banksArr[i].insertRate}</td>
            <td class="maxLoan">${banksArr[i].maxLoan}</td>
            <td class="minPay">${banksArr[i].minPay}</td>
            <td class="loanTerm">${banksArr[i].loanTerm}</td>
            <td><a href="#" onclick="editBank(${i})">&#128397 </a>
            <a href="#" onclick="removeBank(${i})"> &#10006</a></td>`;

        getQuery(tableId).insertBefore(stringBank, document.getElementById('addForm'));
    }
}

function renderSelect() {
    for(let i in banksArr){
        let option = document.createElement('option');
        option.value = i;
        option.innerHTML = banksArr[i].bankName;
        select.appendChild(option);
    }

    select.onchange = () => {
        let val = select.value;
        if(val !== 'placeholder') {
            // console.log(val);
            getQuery('input[name="intLoan"').placeholder = `Max loan $${banksArr[val].maxLoan}`;
            getQuery('input[name="downPay"').placeholder = `Min pay ${banksArr[val].minPay}%`;
        } else {
            getQuery('input[name="intLoan"').placeholder = 'Initial loan';
            getQuery('input[name="downPay"').placeholder = 'Down payment';
        }
    };
}

function calculate() {
    event.preventDefault();

    if(select.value === 'placeholder'){
        alert('Choose the bank');
        return;
    }

    let M;
    let bank = banksArr[select.value];
    let loanVal = +getQuery('input[name="intLoan"').value;
    let downPay = +getQuery('input[name="downPay"').value;
    let P = loanVal - downPay;
    let r = (bank.insertRate)/100;
    let n = bank.loanTerm;

    if(loanVal < 0) return alert('Uncorrect initial Loan');
    if(loanVal > bank.maxLoan) return alert(`Limit of maximum loan is $${bank.maxLoan}`);
    if(downPay < 0 || downPay > loanVal) return alert('Uncorrect down payment');
    if(downPay < (loanVal * bank.minPay/100)) return alert('Need minimum down payment');
    if(loanVal === 0 || downPay === 0) return alert('empty cell');

    M = (P*(r/12)*Math.pow((1+(r/12)), n))/((Math.pow((1+(r/12)), n))-1);

    getQuery('#result').innerHTML = `
        ${banksArr[select.value].bankName} gives a mortgage at ${bank.insertRate} percent per year for a ${n} month.
        <br>
        Your monthly mortgage payment is <span class="green">$${M.toFixed(2)}</span>`;
}

if(!bankTable)firstStart();

banksArr = JSON.parse(bankTable);

if(getQuery(tableId))renderTable();

if(select)renderSelect();









