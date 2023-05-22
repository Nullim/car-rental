const $html = document.querySelector('html');
const $modal = document.querySelector('.modal');
const $finishButtons = document.querySelectorAll('.finish-button');
const $unblockButtons = document.querySelectorAll('.unblock-button');
const $cancelButtons = document.querySelectorAll('.cancel-button')
const $payButtons = document.querySelectorAll('.pay-button');

const handleCloseModal = new Event('closeModal', { bubbles: true });
const handleOpenModal = new Event('openModal', { bubbles: true });

function fillModalContent(Event) {
  const $modalTitle = document.querySelector('.modal-card-title');
  const $modalContent = document.querySelector('.modal-content');
  const $modalForm = document.querySelector('.modal-form');
  const reservation = Event.target.closest('.reservation-data');
  const { id, status } = reservation.dataset;

  if (status === 'Confirmed') {
    $modalTitle.textContent = 'Finish Reservation';
    $modalContent.textContent = `Please confirm that you wish to set Reservation #${id} as finished`;
    $modalForm.action = `/reservations/finish/${id}`;
  } else if (status === 'Finished') {
    $modalTitle.textContent = 'Unblock Reservation';
    $modalContent.textContent = `Please confirm that you wish to set Reservation #${id} as unblocked`;
    $modalForm.action = `/reservations/unblock/${id}`;
  } else if (status === 'Pending') {
    $modalTitle.textContent = 'Pay Reservation';
    $modalContent.textContent = `Please confirm that you wish to set Reservation #${id} as paid`;
    $modalForm.action = `/reservations/pay/${id}`;
  }
}

function clickAway({ target }){
  if(target.classList.contains('modal-background')) target.dispatchEvent(handleCloseModal)
}

function closeModal() {
  $html.classList.remove('is-clipped');
  $modal.classList.remove('is-active');
  $html.removeEventListener('click', clickAway)
}

function openModal(Event) {
  Event.stopPropagation();
  fillModalContent(Event);
  $html.classList.add('is-ckipped');
  $modal.classList.add('is-active');
  $html.addEventListener('click', clickAway);
}

document.addEventListener('openModal', openModal);
document.addEventListener('closeModal', closeModal)

$finishButtons.forEach((button) =>
  button.addEventListener('click', ({ target }) => target.dispatchEvent(handleOpenModal))
);

$unblockButtons.forEach((button) =>
  button.addEventListener('click', ({ target }) => target.dispatchEvent(handleOpenModal))
);

$payButtons.forEach((button) => 
  button.addEventListener('click', ({ target }) => target.dispatchEvent(handleOpenModal))
)

$cancelButtons.forEach((button) =>
  button.addEventListener('click', ({ target }) => target.dispatchEvent(handleCloseModal))
);
