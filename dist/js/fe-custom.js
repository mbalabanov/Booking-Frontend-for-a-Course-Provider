/**
 * SuperEdu FE Logik
 **/

'use strict';

// MomentJS initialisieren
moment.locale('de-at');
const datumHeuteL = moment().format('L');

// Toastr Einstellungen definieren
toastr.options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-top-right",
  "preventDuplicates": true,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "0",
  "extendedTimeOut": "0",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "slideUp"
}

// API URL definieren
const APIURL = 'https://apiserver010.herokuapp.com/';
// const APIURL = 'http://localhost:3000/';

// Globale Variablen definieren
let rawCoursesData = {};
let rawEventsData = {};
let rawLocationsData = {};
let rawPersonsData = {};
let rawTimetableData = {};
let rawBookingsData = {};
let rawMessagesData = {};

let filteredCoursesData = {};
let filteredEventsData = {};
let filteredLocationsData = {};
let filteredTrainersData = {};
let filteredStudentsData = {};
let filteredBookingsData = {};
let filteredMessagesData = {};

let startDateMoment = '';
let endDateMoment = '';

let filterKursID = '';
let filterEventID = '';
let trainerMailList = [];

let studentFirstName = '';
let studentLastName = '';
let studentEmail = '';
let studentPhone = '';
let studentStreet = '';
let studentCity =  '';
let studentZipCode = '';
let messageSubject = '';
let buchungsdetails = '';


// Funktion für die Ansprache der API (lesen und schreiben)
async function asyncAPI(method, data, table, id) {
    const newID = (!id) ? '' : id;
    const url = `${APIURL}${table}/${newID}`;

    const response = await axios({
        method,
        url,
        data,
        timeout: 10000
    })

    return response.data;

}

// Funktion für den Aufbau und der Anzeige der Startseite
function renderFrontendDisplay() {
	$('#fewrapper')
		.empty()
		.append(elementFENavbar)
		.append('<div class="container">' + elementFEJumbotron +'</div>')
		.append(elementFECourseArea)
		.append('<div class="container">' + elementFEFooterJumbotron +'</div>')
		.append(elementFEFooter)
		.append(elementCourseDetailsModal);

		alleDatenHolen();
}

// Erster API-Aufruf, um die Daten einzuholen
async function alleDatenHolen() {
	rawCoursesData = await asyncAPI('get', null, 'courses');
	rawEventsData = await asyncAPI('get', null, 'events');
	rawLocationsData = await asyncAPI('get', null, 'locations');
	rawPersonsData = await asyncAPI('get', null, 'persons');
	rawTimetableData = await asyncAPI('get', null, 'timetables');
	rawBookingsData = await asyncAPI('get', null, 'bookings');
	rawMessagesData = await asyncAPI('get', null, 'messages');

	loadTeasers();

}

// Die Boxen mit den Kursen auf der Startseite anzeigen
function loadTeasers() {

	for (let i in rawCoursesData) {
		$('#teaser').append(`
		  <div class="col-sm-6 col-lg-4 mt-4">
			<div class="card h-100">
			  <a href="#" data-courseid="${rawCoursesData[i].id}" class="teaseropen" data-toggle="modal" data-target="#CourseDetailsModal"><img class="card-img-top" src="${rawCoursesData[i].imageurl}" alt="${rawCoursesData[i].name}"></a>
			  <div class="card-body">
				<h5 class="card-title"><a href="#" data-courseid="${rawCoursesData[i].id}" class="teaseropen" data-toggle="modal" data-target="#CourseDetailsModal">${rawCoursesData[i].name}</a></h5>
				<p class="card-text">${rawCoursesData[i].shortDescription}</p>
			  </div>
			  <div class="card-footer">
				<a href="#" data-courseid="${rawCoursesData[i].id}" class="btn btn-primary teaseropen" data-toggle="modal" data-target="#CourseDetailsModal">Kursinfo</a>
			  </div>
			</div>
		  </div>
		`)
	}

	// Wenn auf den Button im Kursteaser geklickt wird, dann wird die KursID übernommen und an die Funktion übergeben
	$('.teaseropen').click(function() {
		filterKursID = $(this).data('courseid')
		displayCourseDetails(filterKursID);
	});

}

async function displayCourseDetails(filterKursID) {

	// Die Daten werden anhand der übernommenen ID gefiltert, um die Detailansicht aufzubauen
	filteredCoursesData = rawCoursesData.filter(item => item.id == filterKursID);
	filteredEventsData = rawEventsData.filter(item => item.courseID == filterKursID);

	// Der Jumbotron am Anfang der Kursdetails wird angezeigt
	$('#kurstitel')
		.empty()
		.append(`
			<div class="jumbotron">
				<h2>${filteredCoursesData[0].name}</h2>
				<p>${filteredCoursesData[0].shortDescription}</p>
			</div>
		`);

	// Die Kurstabelle wird geleert, dann werden die einzelnen Event-Zeilen generiert, aus denen dann die Kurstabelle zusammengestellt wird
	$('#kurstabelle').empty();
	for (let i in filteredEventsData) {

		// Der Buchungsgrad wird geleert, um für die jeweilige Event-Zeile anzuzeigen, ob noch Plätze frei sind.
		let buchungsGrad = '';

		// Die dazugehörigen Buchungen werden anhand der EventID gesucht, die Anzahl der Buchungen wird ermittelt
		filteredBookingsData = rawBookingsData.filter(item => item.eventID == filteredEventsData[i].id);
		const anzahlBuchungen = Object.keys(filteredBookingsData).length;

		// Die dazugehörigen Locations und Trainer werden anhand der EventID gesucht
		filteredLocationsData = rawLocationsData.filter(item => item.id == filteredEventsData[i].locationID);
		filteredTrainersData = rawPersonsData.filter(item => item.id == filteredEventsData[i].trainerID);

		// Hier wird das Datum des jeweiligen Events geholt und mit MomentJS menschenlesbar gemacht
		startDateMoment = moment(filteredEventsData[i].startDate).format('ll');
		endDateMoment = moment(filteredEventsData[i].endDate).format('ll');

		// Abhängig von der Anzahl der Buchungen und der Kapazität eines Kurses wird die Warnung über den Buchungsgrad vorbereitet, um berücksichtigt zu werden, wenn im nächsten Schritt die Tabelle generiert wird
		if (anzahlBuchungen >= filteredEventsData[i].capacity) {
			buchungsGrad=`<td><small><div class="alert alert-danger text-center">Ausgebucht</div></small></td></td><td><a href="stundenplan.html?course=${filteredCoursesData[0].id}&event=${filteredEventsData[i].id}" class="btn btn-outline-secondary btn-sm" target="_blank">Stundenplan</a></td>`;
		} else if (anzahlBuchungen >= (filteredEventsData[i].capacity/5)*4) {
			buchungsGrad=`<td><small><div class="alert alert-warning text-center">Wenige Plätze</div></small></td><td><a href="stundenplan.html?course=${filteredCoursesData[0].id}&event=${filteredEventsData[i].id}" class="btn btn-outline-secondary btn-sm text-center" target="_blank">Stundenplan</a><br><a href="#" class="btn btn-primary btn-sm mt-2 text-center bookingopen" data-eventid="${filteredEventsData[i].id}" data-dismiss="modal" aria-label="Close" data-toggle="modal" data-target="#bookingModal">Jetzt buchen</a></td>`;
		} else {
			buchungsGrad=`<td><small><div class="alert alert-success text-center">Plätze frei</div></small></td><td><a href="stundenplan.html?course=${filteredCoursesData[0].id}&event=${filteredEventsData[i].id}" class="btn btn-outline-secondary btn-sm text-center" target="_blank">Stundenplan</a><br><a href="#" class="btn btn-primary btn-sm mt-2 text-center bookingopen" data-eventid="${filteredEventsData[i].id}" data-dismiss="modal" aria-label="Close" data-toggle="modal" data-target="#bookingModal">Jetzt buchen</a></td>`;
		}

		// Wenn das Startdatum eines Kurses in der Vergangenheit liegt, dann wird die Kurstabelle die Buchungsoption und mit einem Hinweis angezeigt
		if (moment().isAfter(filteredEventsData[i].startDate)) {
			$('#kurstabelle').append(`
				<tr>
					<td>${startDateMoment} bis <br>${endDateMoment}</td>
					<td><a href="#" tabindex="${i}"role="button" class="popover-test" data-trigger="focus" data-toggle="popover" title="${filteredLocationsData[0].name}" data-content="${filteredLocationsData[0].street}, ${filteredLocationsData[0].zipCode} ${filteredLocationsData[0].city}">${filteredLocationsData[0].name}</a></td>
					<td>${filteredTrainersData[0].firstName} ${filteredTrainersData[0].lastName}</td>
					<td colspan="2"><small><div class="alert alert-dark text-center">Vergangener Kurs</div></small></td>
				</tr>
			`);
		} else {
			$('#kurstabelle').append(`
				<tr>
					<td>${startDateMoment} bis <br>${endDateMoment}</td>
					<td><a href="#" tabindex="${i}"role="button" class="popover-test" data-trigger="focus" data-toggle="popover" title="${filteredLocationsData[0].name}" data-content="${filteredLocationsData[0].street}, ${filteredLocationsData[0].zipCode} ${filteredLocationsData[0].city}">${filteredLocationsData[0].name}</a></td>
					<td>${filteredTrainersData[0].firstName} ${filteredTrainersData[0].lastName}</td>
					${buchungsGrad}
				</tr>
			`);
		}
	}

	// Die Kursbeschreibung wird zusammengestellt
	$('#kursdetails')
		.empty()
		.append(`
			<div class="accordion" id="accordionCourseDetails">
				<div class="card">
    				<div class="card-header" id="headingOne">
      					<h2 class="mb-0">
      						<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
      							Kursinhalte
      						</button>
      					</h2>
      				</div>
      				<div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordionCourseDetails">
      					<div class="card-body">
							<p>${filteredCoursesData[0].longDescription}</p>
							<p><img src="${filteredCoursesData[0].imageurl}" class="img-thumbnail"></p>
						</div>
    				</div>
  				</div>
  				<div class="card">
    				<div class="card-header" id="headingTwo">
      					<h2 class="mb-0">
        					<button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
								Zielsetzung
        					</button>
      					</h2>
    				</div>
    				<div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionCourseDetails">
      					<div class="card-body">
							<p>${filteredCoursesData[0].goal}</p>
						</div>
					</div>
				</div>
				<div class="card">
					<div class="card-header" id="headingThree">
						<h2 class="mb-0">
							<button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
								Zielgruppe
							</button>
						</h2>
					</div>
					<div id="collapseThree" class="collapse" aria-labelledby="headingThree" data-parent="#accordionCourseDetails">
						<div class="card-body">
							<p>${filteredCoursesData[0].targetGroup}</p>
      					</div>
					</div>
				</div>
				<div class="card">
					<div class="card-header" id="headingFour">
						<h2 class="mb-0">
							<button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
								Voraussetzungen
							</button>
						</h2>
					</div>
					<div id="collapseFour" class="collapse" aria-labelledby="headingFour" data-parent="#accordionCourseDetails">
						<div class="card-body">
							<p>${filteredCoursesData[0].requirements}</p>
      					</div>
					</div>
				</div>
			</div>
		`);

		// Der Popover für die Location-Daten wird initialisiert
		$(function () {
		  $('[data-toggle="popover"]').popover()
		})

		// Das Modal für die Buchung wird auf der Seite vorbereitet
		$('#fewrapper').append(elementBookingModal);

		// Der Button für die Buchung wird mit einem Eventlistener vorbereitet, damit bei Klick die Buchungsansicht angezeigt wird
		$('.bookingopen').click(function() {
			filterEventID = $(this).data('eventid')
			displayCourseBooking(filterEventID);
		});
}

// In der Buchungsansicht werden die Kursdetails angezeigt, dann wird das Buchungsformular bereitgestellt
async function displayCourseBooking(filterEventID) {
	filteredEventsData = rawEventsData.filter(item => item.id == filterEventID);
	filteredLocationsData = rawLocationsData.filter(item => item.id == filteredEventsData[0].locationID);
	filteredTrainersData = rawPersonsData.filter(item => item.isTrainer);

	startDateMoment = moment(filteredEventsData[0].startDate).format('LL');
	endDateMoment = moment(filteredEventsData[0].endDate).format('LL');

	// Trainer für die Benachrichtigung heraussuchen
	for (let i in filteredTrainersData) {
		trainerMailList.push(filteredTrainersData[i].id);
	}

	// Die Buchungsdetails werden vorbereitet und im Buchungs-Modal eingefügt
	$('#buchungsdetails')
		.empty()
		.append(`
			<table class="table table-striped">
				<tbody>
					<tr><td colspan="2"><h4>${filteredEventsData[0].name} </h4></td></tr>
					<tr><th>Termin: </th><td>${startDateMoment} bis ${endDateMoment} </td></tr>
					<tr><th>Kursbezeichnung: </th><td><span id="kursbezeichnung">${filteredEventsData[0].name} (ID${filteredEventsData[0].id})</span></td></tr>
					<tr><th>Ort: </th><td>${filteredLocationsData[0].name}, ${filteredLocationsData[0].street}, ${filteredLocationsData[0].zipCode} ${filteredLocationsData[0].city} </td></tr>
					<tr><th>Preis: </th><td>€ ${filteredEventsData[0].price},-</td></tr>
				</tbody>
			</table>
		`);

	// Bei Klick auf den Button für die Event-Anmeldung wird das Formular validiert
    $('#buttonEventBuchung').click(function(event) {
     	event.preventDefault();

		// Die Anmeldedaten des Studenten werden geholt
		studentFirstName = $('#formAnmeldungDaten [name=firstname]').val();
		studentLastName = $('#formAnmeldungDaten [name=lastname]').val();
		studentEmail = $('#formAnmeldungDaten [name=to]').val();
		studentPhone = $('#formAnmeldungDaten [name=phone]').val();
		studentStreet = $('#formAnmeldungDaten [name=street]').val();
		studentCity = $('#formAnmeldungDaten [name=city]').val();
		studentZipCode = $('#formAnmeldungDaten [name=zipCode]').val();
		messageSubject = $('#kursbezeichnung').text();
		buchungsdetails = $('#buchungsdetails').html();

		$('#studentFirstNameCheck').empty();
		$('#studentLastNameCheck').empty();
		$('#studentEmailCheck').empty();

		// Eine sehr minimale Validierung
		if (studentFirstName.length < 2) {
			$('#studentFirstNameCheck').append('<small><div class="alert alert-danger text-center">Bitte geben Sie Ihren Vornamen ein.</div></small>');
		}

		if (studentLastName.length < 2) {
			$('#studentLastNameCheck').append('<small><div class="alert alert-danger text-center">Bitte geben Sie Ihren Nachnamen ein.</div></small>');
		}

		if(!(/\S+@\S+\.\S+/.test(studentEmail))) {
			$('#studentEmailCheck').append('<small><div class="alert alert-danger text-center">Bitte geben Sie eine gültige Email-Adresse ein.</div></small>');
		}

		if (studentFirstName.length > 1 && studentLastName.length > 1 && studentEmail.length > 4 && /\S+@\S+\.\S+/.test(studentEmail)) {
			buchenFormCheckPerson();
			$('#bookingModal').modal('hide');
		}

    });

}

// Hier wird geprüft, ob die Person bereits existiert und ob für diesen Event bereits eine Buchung vorliegt
async function buchenFormCheckPerson() {

	// Vor der Buchung noch die Daten aktualisieren
	rawEventsData = await asyncAPI('get', null, 'events');
	rawPersonsData = await asyncAPI('get', null, 'persons');
	rawBookingsData = await asyncAPI('get', null, 'bookings');

	// Es wird abgefragt, ob es die Person bereits gibt
	if (!rawPersonsData.find(item => item.email == studentEmail)) {

		// Da es die Person noch nicht gibt (und sie somit nicht bereits bei einem Kurs angemeldet sein kann), wird die Person angelegt und die Kursanmeldung durchgeführt
		studentAnlegen();
		studentKursAnmelden();
	} else {

		// Da es die Person bereits gibt, wird nun nachgesehen, ob sie sich für diesen Event angemeldet hat.
		let filteredStudentID = rawPersonsData.filter(item => item.email == studentEmail);
		if (rawBookingsData.find(item => item.studentID == filteredStudentID[0].id && item.eventID == filteredEventsData[0].id)) {

			// Die Kursanmeldung ist nicht erforderlich, da die Person bereits für diesen Kurs angemeldet ist.
			toastr.error('Ein Benutzer mit Ihrer Email-Adresse ist bereits für diesen Kurs angemeldet: ' + messageSubject, 'Ihr Benutzer war bereits angemeldet!');

			// Nach der Fehlermeldung wird das Frontend einem Reset unterzogen
			$('#fewrapper').empty();
			renderFrontendDisplay();
		} else {

			// Es wird nur die Kursanmeldung durchgeführt.
			studentKursAnmelden();
		}
	}
}

async function studentAnlegen() {

	// Die Daten des neu anzulegenden Students werden zusammengestellt
	const studentData = {
		firstName: studentFirstName,
		lastName: studentLastName,
		photo: '',
		url: '',
		phone: studentPhone,
		email: studentEmail,
		password: '',
		street: studentStreet,
		city: studentCity,
		zipCode: studentZipCode,
		isAdmin: false,
		isTrainer: false,
		isStudent: true,
		isSystem: false,
		isDeleted: false
	};

	// Die neue Person wird über die API eingetragen
	await asyncAPI('post', studentData, 'persons');

}

async function studentKursAnmelden() {

	// Anhand der Email-Adresse nachprüfen, wie die StudentID des neu angelegten Students lautet
	rawPersonsData = await asyncAPI('get', null, 'persons');
	let filteredStudentIDData = rawPersonsData.filter(item => item.email == studentEmail);

	// Der Text für die Emailantwort an den Studenten wird zusammengestellt
	const studentMessagetext = `
	Hallo ${studentFirstName} ${studentLastName},<br><br>Ihre Buchung ist von der Email-Adresse ${studentEmail} eingelangt. Sie haben folgenden Kurs gebucht:<br><br>
	${buchungsdetails}<br><br>Vielen Dank für Ihre Buchung, Sie erhalten in Kürze die Rechnung.<br><br>Mit freundlichen Grüßen,<br>Ihr KURSI-Team
	`;

	// Der Text für die Nachricht an die Administratoren wird zusammengestellt
	const adminMessagetext = `
	Hallo liebe Administratoren, eine neue Kursbuchung ist eingelangt. ${studentFirstName} ${studentLastName}, Email-Adresse ${studentEmail}, Wohnadresse ${studentStreet}, ${studentZipCode} ${studentCity} mit der Telefonnummer ${studentPhone} hat folgenden Kurs gebucht:
	${buchungsdetails} - Dies ist eine automatische Nachricht.
	`;

	// ACHTUNG! Dieser Code kann wegen des Domain-spezifischen Tokens nicht lokal oder auf einer anderen Domain ausgeführt werden.
	// Es wurde in der Angabe zwar nicht verlangt, eine Buchungs-Email an den Student zu schicken, es macht aber Sinn dies zu tun, damit die Person eine Anmeldebestätigung hat.
	const studentResult = await Email.send({
        SecureToken : "3f0bc627-f850-43c9-9aeb-b390eb67e21c",
		To : $('#formAnmeldungDaten [name=to]').val(),
		From : "marincomics@gmail.com",
		Subject : messageSubject,
		Body : studentMessagetext
	});

	if (studentResult === 'OK') {

		// Zusammenstellung des Bookings
		const bookingData = {
			eventID: filterEventID,
			studentID: filteredStudentIDData[0].id,
			paid: false,
			finished: false,
			certificate: false
		}

		// Eintragung in Bookings
		await asyncAPI('post', bookingData, 'bookings');

		// Zusammenstellung der Nachrichten für die Trainer und danach die Eintragung in Messages
		for (let i in trainerMailList) {

			let adminMessageData = {
				date: datumHeuteL,
				personSenderID: 0,
				personReceiverID: trainerMailList[i],
				subject: messageSubject,
				body: adminMessagetext,
				read: false
			}

			await asyncAPI('post', adminMessageData, 'messages');
		}

		toastr.success('Ihre Kursanmeldung wurde erfolgreich durchgeführt: ' + messageSubject, 'Kurs gebucht!')

		// Nach der Erfolgsmeldung wird das Frontend einem Reset unterzogen
		$('#fewrapper').empty();
		renderFrontendDisplay();

	} else {

		// Wenn die Email nicht verschickt werden kann, dann kommt diese Fehlermeldung
		toastr.error('Es ist ein Fehler bei der Buchung aufgetreten.', 'Fehler bei der Buchung')

		// Nach der Fehlermeldung wird das Frontend einem Reset unterzogen
		$('#fewrapper').empty();
		renderFrontendDisplay();
		return false;
	}
}
