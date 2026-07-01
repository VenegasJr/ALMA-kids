document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('feedbackForm');
  const incidentFields = document.getElementById('incidentFields');
  const incidentType = document.getElementById('tipo-incidente');
  const incidentDetail = document.getElementById('detalle-incidente');
  const contactCase = document.getElementById('contacto-caso');
  const timestamp = document.getElementById('fechaRegistro');

  if (timestamp) timestamp.value = new Date().toISOString();

  const updateIncidentVisibility = () => {
    const selected = document.querySelector('input[name="tuvo_inconveniente"]:checked');
    const show = selected && selected.value === 'Sí';
    if (!incidentFields) return;
    incidentFields.hidden = !show;
    [incidentType, incidentDetail, contactCase].forEach((field) => {
      if (field) field.required = Boolean(show);
    });
  };

  document.querySelectorAll('input[name="tuvo_inconveniente"]').forEach((radio) => {
    radio.addEventListener('change', updateIncidentVisibility);
  });

  if (form) {
    form.addEventListener('submit', (event) => {
      updateIncidentVisibility();
      if (!form.checkValidity()) {
        event.preventDefault();
        const firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) {
          firstInvalid.focus();
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }
});
