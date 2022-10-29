const addMemoForm = document.getElementById('memoForm')
const newMemoInput = document.getElementById('newMemoInput')
const memoList = document.getElementById('memoList')

let memoArr = JSON.parse(localStorage.getItem('memoArr')) || [];

renderMemo();

addMemoForm.addEventListener('submit', (e) => {
    e.preventDefault()

    addNewMemo()
    renderMemo()
    localStorage.setItem('memoArr', JSON.stringify(memoArr))
})

function addNewMemo() {
    const newMemoValue = newMemoInput.value

    const isEmptyMemo = newMemoValue === ""

    if (isEmptyMemo){
        return
    } else {
        const memoStruct = {
            id: memoArr.length,
            title: newMemoValue
        }
        memoArr.push(memoStruct)
    }
    newMemoInput.value = ""
}

function renderMemo() {
    const memoCardHtml = memoArr.map((memo) => {
        return `
            <div class="memoCard" id = "${memo.id}">
            <div class="memoCardContent">
                <input class="memoTitle" value="${memo.title}" readonly="readonly">
            </div>
            <div class="memoCardFooter">
                <button class="editBtn" data-action ="edit">수정</button>
                <button class="deleteBtn" data-action ="delete">삭제</button>
                <button class="doneBtn" data-action="edit-done" style = display:none; >완료</button>
                <button class="cancelBtn" data-action="edit-cancel" style = display:none; >최소</button>
                </div>
        </div>
        `
    }).join('')
    memoList.innerHTML = memoCardHtml
}

memoList.addEventListener('click', (e) => {
    const target = e.target;
    const selectedParentElement = target.parentElement.parentElement;

    if (selectedParentElement.className === 'memoCard'){
        const selectedElementId = selectedParentElement.id
        const selectedMemoId = memoArr.findIndex(
            elements => elements.id == Number(selectedElementId)
        );
        const selectedMemo = memoArr[selectedMemoId]

        const action = target.dataset.action
        action === 'edit' && editMemo(selectedParentElement, selectedElementId)

        action === 'delete' && deleteMemo(selectedElementId)
        console.log(selectedParentElement)
    } else {
        return
    }
});

function editMemo(selectedParentElement, selectedElementId){
    const editMemoInput = selectedParentElement. querySelector(".memoTitle")
    const editBtn = selectedParentElement. querySelector(".editBtn")
    const deleteBtn = selectedParentElement. querySelector(".deleteBtn")
    const doneBtn = selectedParentElement. querySelector(".doneBtn")
    const cancelBtn = selectedParentElement. querySelector(".cancelBtn")

    editMemoInput.removeAttribute('readonly');

    editBtn.style.display = "none";
    deleteBtn.style.display = "none";
    doneBtn.style.display = "inline-block";
    cancelBtn.style.display = "inline-block"

    doneBtn.addEventListener('click', (e) => {
        const editMemoInputValue = editMemoInput.value
        const isEmptyEditMemo = editMemoInputValue === ""

        if(isEmptyEditMemo) {
            return
        } else {
            const selectedMemoId = memoArr.findIndex(element => element.id === Number(selectedElementId))
            memoArr[selectedMemoId].title = editMemoInputValue
            renderMemo();
            localStorage.setItem('memoArr', JSON.stringify(memoArr))
        }
    });

    cancelBtn.addEventListener('click', (e) => {
        renderMemo();
        localStorage.setItem('memoArr', JSON.stringify(memoArr))
    });
}

function deleteMemo(selectedElementId){
    memoArr.splice(selectedElementId, 1)
    renderMemo()
    localStorage.setItem('memoArr', JSON.stringify(memoArr))
}