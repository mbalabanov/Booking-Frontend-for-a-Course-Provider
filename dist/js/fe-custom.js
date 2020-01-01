/**
 * SuperEdu FE Logik
 **/

'use strict';

moment.locale('de-at');
const datumHeuteL = moment().format('L');

toastr.options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": true,
  "progressBar": false,
  "positionClass": "toast-top-center",
  "preventDuplicates": true,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "10000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "slideUp"
}


const APIURL = 'https://apiserver010.herokuapp.com/';
// const APIURL = 'http://localhost:3000/';

let courseData = null;

function renderFrontendDisplay() {

	$('#fewrapper')
		.empty()
		.append(elementFENavbar)
		.append('<div class="container">' + elementFEJumbotron +'</div>')
		.append(elementFECourseArea)
		.append('<div class="container">' + elementFEFooterJumbotron +'</div>')
		.append(elementFEFooter)
		.append(elementCourseDetailsModal)
		.append(elementBookingModal);

		loadTeasers();
}

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

async function loadTeasers() {
    const allCourses = await asyncAPI('get', null, 'courses');
	
	for (let i in allCourses) {
		$('#teaser').append(`
		  <div class="col-sm-6 col-lg-4 mt-4">
			<div class="card h-100">
			  <a href="#" data-courseid="${allCourses[i].id}" class="teaseropen" data-toggle="modal" data-target="#CourseDetailsModal"><img class="card-img-top" src="${allCourses[i].imageurl}" alt="${allCourses[i].name}"></a>
			  <div class="card-body">
				<h5 class="card-title"><a href="#" data-courseid="${allCourses[i].id}" class="teaseropen" data-toggle="modal" data-target="#CourseDetailsModal">${allCourses[i].name}</a></h5>
				<p class="card-text">${allCourses[i].shortDescription}</p>
			  </div>
			  <div class="card-footer">
				<a href="#" data-courseid="${allCourses[i].id}" class="btn btn-primary teaseropen" data-toggle="modal" data-target="#CourseDetailsModal">Kursinfo</a>
			  </div>
			</div>
		  </div>
		`)
	}
	
	$('.teaseropen').click(function() {
		let filterID = $(this).data('courseid')
		event.preventDefault();
		displayCourseDetails(filterID);
	});

}

async function displayCourseDetails(filterID) {
	const rawCoursesData = await asyncAPI('get', null, 'courses');
	const rawEventsData = await asyncAPI('get', null, 'events');
	const rawLocationsdata = await asyncAPI('get', null, 'locations');
	const rawPersonsdata = await asyncAPI('get', null, 'persons');
	const rawBookingsdata = await asyncAPI('get', null, 'bookings');
	
	let filteredCoursesData = rawCoursesData.filter(item => item.id == filterID);
	let filteredEventsData = rawEventsData.filter(item => item.courseID == filterID);
	
	$('#kurstitel')
		.empty()
		.append(`
			<div class="jumbotron">
				<h2>${filteredCoursesData[0].name}</h2>
				<p>${filteredCoursesData[0].shortDescription}</p>
			</div>
		`);
	
	$('#kurstabelle').empty()
	
	for (let i in filteredEventsData) {

		let buchungsGrad = '';
		const filteredBookingsData = rawBookingsdata.filter(item => item.eventID == filteredEventsData[i].id);
		const anzahlBuchungen = Object.keys(filteredBookingsData).length;
	
		const filteredLocationsData = rawLocationsdata.filter(item => item.id == filteredEventsData[i].locationID);
		const filteredTrainersData = rawPersonsdata.filter(item => item.id == filteredEventsData[i].trainerID);
		const startDateMoment = moment(filteredEventsData[i].startDate).format('ll');
		const endDateMoment = moment(filteredEventsData[i].endDate).format('ll');
		const datumKursL = moment(filteredEventsData[i].startDate).format('L');
		let deprecated = '';

		if (anzahlBuchungen >= filteredEventsData[i].capacity) {
			buchungsGrad=`<td><small><div class="alert alert-danger text-center">Ausgebucht</div></small></td></td><td><a href="stundenplan.html?course=${filteredCoursesData[0].id}&event=${filteredEventsData[i].id}" class="btn btn-outline-secondary btn-sm" target="_blank">Stundenplan</a></td>`;
		} else if (anzahlBuchungen >= (filteredEventsData[i].capacity/5)*4) {
			buchungsGrad=`<td><small><div class="alert alert-warning text-center">Wenige Plätze</div></small></td><td><a href="stundenplan.html?course=${filteredCoursesData[0].id}&event=${filteredEventsData[i].id}" class="btn btn-outline-secondary btn-sm text-center" target="_blank">Stundenplan</a><br><a href="#" class="btn btn-primary btn-sm mt-2 text-center bookingopen" data-eventid="${filteredEventsData[i].id}" data-dismiss="modal" aria-label="Close" data-toggle="modal" data-target="#bookingModal">Jetzt buchen</a></td>`;
		} else {
			buchungsGrad=`<td><small><div class="alert alert-success text-center">Plätze frei</div></small></td><td><a href="stundenplan.html?course=${filteredCoursesData[0].id}&event=${filteredEventsData[i].id}" class="btn btn-outline-secondary btn-sm text-center" target="_blank">Stundenplan</a><br><a href="#" class="btn btn-primary btn-sm mt-2 text-center bookingopen" data-eventid="${filteredEventsData[i].id}" data-dismiss="modal" aria-label="Close" data-toggle="modal" data-target="#bookingModal">Jetzt buchen</a></td>`;
		}
		
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
					<td>${startDateMoment} bis <br>${endDateMoment}<br><span id="pastevent${i}">${deprecated}</span></td>
					<td><a href="#" tabindex="${i}"role="button" class="popover-test" data-trigger="focus" data-toggle="popover" title="${filteredLocationsData[0].name}" data-content="${filteredLocationsData[0].street}, ${filteredLocationsData[0].zipCode} ${filteredLocationsData[0].city}">${filteredLocationsData[0].name}</a></td>
					<td>${filteredTrainersData[0].firstName} ${filteredTrainersData[0].lastName}</td>
					${buchungsGrad}
				</tr>
			`);
		}
	}
	
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
		
		$(function () {
		  $('[data-toggle="popover"]').popover()
		})
		
		$('.bookingopen').click(function() {
			let filterID = $(this).data('eventid')
			displayCourseBooking(filterID);
		});
}

async function displayCourseBooking(filterID) {
	const rawEventsData = await asyncAPI('get', null, 'events');
	const rawLocationsData = await asyncAPI('get', null, 'locations');
	const rawPersonsdata = await asyncAPI('get', null, 'persons');
	let filteredEventsData = rawEventsData.filter(item => item.id == filterID);
	let filteredLocationsData = rawLocationsData.filter(item => item.id == filteredEventsData[0].locationID);
	let filteredTrainerData = rawPersonsdata.filter(item => item.isTrainer);

	let courseStartDateMoment = moment(filteredEventsData[0].startDate).format('LL');
	let courseEndDateMoment = moment(filteredEventsData[0].endDate).format('LL');

	// Trainer für die Benachrichtigung heraussuchen
	let trainerMailList = [];
	for (let i in filteredTrainerData) {
		trainerMailList.push(filteredTrainerData[i].id);
	}
	
	$('#buchendetails')
		.empty()
		.append(`
			<table class="table table-striped">
				<tbody>
					<tr><td colspan="2"><h4>${filteredEventsData[0].name} </h4></td></tr>
					<tr><th>Termin: </th><td>${courseStartDateMoment} bis ${courseEndDateMoment} </td></tr>
					<tr><th>Kursbezeichnung: </th><td><span id="kursbezeichnung">${filteredEventsData[0].name} (ID${filteredEventsData[0].id})</span></td></tr>
					<tr><th>Ort: </th><td>${filteredLocationsData[0].name}, ${filteredLocationsData[0].street}, ${filteredLocationsData[0].zipCode} ${filteredLocationsData[0].city} </td></tr>
					<tr><th>Preis: </th><td>€ ${filteredEventsData[0].price},-</td></tr>
				</tbody>
			</table>
		`);
	$('#anmeldeformular')
		.empty()
		.append(anmeldeformular);

    $('#buttonSMTPMailer').click(async function(event) {
        event.preventDefault();

		const rawStudentData = await asyncAPI('get', null, 'persons');
		const rawStudentsBookingsData = await asyncAPI('get', null, 'bookings');

		let firstName = $('#formSMTPMailer [name=firstname]').val();
		let lastName = $('#formSMTPMailer [name=lastname]').val();
		let studentEmail = $('#formSMTPMailer [name=to]').val();
		let studentPhone = $('#formSMTPMailer [name=phone]').val();
		let studentStreet = $('#formSMTPMailer [name=street]').val();
		let studentCity = $('#formSMTPMailer [name=city]').val();
		let studentZipCode = $('#formSMTPMailer [name=zipCode]').val();
		let messageSubject = $('#kursbezeichnung').text();
		let bookedCourse = $('#buchendetails').text();
		
		// Wenn der Benutzeraccount, nicht angelegt ist, dann Benutzeraccount anlegen
		// Wenn der Benutzeraccount angelegt ist, aber der Benutzer nicht in diesem Kurs angemeldet ist, dann Benutzer anmelden
		// Wenn Benutzer für den Kurs angemeldet ist, dann Fehlermeldung ausgeben
		
		
		// Nachprüfen, ob der Benutzeraccount bereits angelegt ist

		if (!rawStudentData.find(item => item.email == studentEmail)) {
			$('#bookingModal').modal('hide');

			const studentData = {
				firstName: firstName,
				lastName: lastName,
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
			}
		
			await asyncAPI('post', studentData, 'persons');
		
			// Die StudentID des neuen Kursteilnehmers einholen
			const rawPersonsIDData = await asyncAPI('get', null, 'persons');
			const filteredStudentIDData = rawPersonsIDData.filter(item => item.email == studentEmail);

			let studentMessagetext = `
			Hallo ${firstName} ${lastName},<br><br>Ihre Buchung ist von der Email-Adresse ${studentEmail} eingelangt. Sie haben folgenden Kurs gebucht:<br><br>
			${bookedCourse}<br><br>Vielen Dank für Ihre Buchung, Sie erhalten in Kürze die Rechnung.<br><br>Mit freundlichen Grüßen,<br>Ihr KURSI-Team
			`;
		
			let adminMessagetext = `
			Hallo liebe Administratoren, eine neue Kursbuchung ist eingelangt. ${firstName} ${lastName}, Email-Adresse ${studentEmail}, Wohnadresse ${studentStreet}, ${studentZipCode} ${studentCity} mit der Telefonnummer ${studentPhone} hat folgenden Kurs gebucht:
			${bookedCourse} - Dies ist eine automatische Nachricht.
			`;

			const studentResult = await Email.send({
				SecureToken : "3f0bc627-f850-43c9-9aeb-b390eb67e21c",
				To : $('#formSMTPMailer [name=to]').val(),
				From : "marincomics@gmail.com",
				Subject : messageSubject,
				Body : studentMessagetext
			});
		
			if (studentResult === 'OK') {
				toastr.success('Ihr Benutzer wurde angelegt und Ihre Kursanmeldung wurde erfolgreich durchgeführt.', 'Benutzer angelegt und Kurs gebucht!')
				
				const bookingData = {
					eventID: filterID,
					studentID: filteredStudentIDData[0].id,
					paid: false,
					finished: false,
					certificate: false
				}
		
				await asyncAPI('post', bookingData, 'bookings');

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
				
			} else {
				toastr.error('Es ist ein Fehler bei der Buchung aufgetreten.', 'Fehler bei der Buchung')
				return false;
			}

		} else {
			$('#bookingModal').modal('hide');

			let filteredStudentID = rawStudentData.filter(item => item.email == studentEmail);
			console.log('filteredStudentID vor der if-Abfrage');
			console.log(filteredStudentID);


			if (rawStudentsBookingsData.find(item => item.studentID == filteredStudentID[0].id && item.eventID == filteredEventsData[0].id)) {
				toastr.primary('Ein Benutzer mit Ihrer Email-Adresse ist bereits für diesen Kurs angemeldet.', 'Ihr Benutzer war bereits angemeldet!');
			} else {
			
				let studentMessagetext = `Hallo ${firstName} ${lastName},<br><br>Ihre Buchung ist von der Email-Adresse ${studentEmail} eingelangt. Sie haben folgenden Kurs gebucht:<br><br>
				${bookedCourse}<br><br>Vielen Dank für Ihre Buchung, Sie erhalten in Kürze die Rechnung.<br><br>Mit freundlichen Grüßen,<br>Ihr KURSI-Team`;
		
				let adminMessagetext = `Hallo liebe Administratoren, eine neue Kursbuchung ist eingelangt. ${firstName} ${lastName}, Email-Adresse ${studentEmail}, Wohnadresse ${studentStreet}, ${studentZipCode} ${studentCity} mit der Telefonnummer ${studentPhone} hat folgenden Kurs gebucht:
				${bookedCourse} - Dies ist eine automatische Nachricht.`;

				const studentResult = await Email.send({
					SecureToken : "3f0bc627-f850-43c9-9aeb-b390eb67e21c",
					To : $('#formSMTPMailer [name=to]').val(),
					From : "marincomics@gmail.com",
					Subject : messageSubject,
					Body : studentMessagetext
				});
		
				if (studentResult === 'OK') {
					toastr.warning('Ihre Kursanmeldung wurde erfolgreich durchgeführt. Ihr Benutzer war bereits angelegt.', 'Kurs gebucht!');
					
					console.log('filteredStudentID vor der Fehlermeldung');
					console.log(filteredStudentID);
					
					const bookingData = {
						eventID: filterID,
						studentID: filteredStudentID[0].id,
						paid: false,
						finished: false,
						certificate: false
					}
		
					await asyncAPI('post', bookingData, 'bookings');

					for (let i in trainerMailList) {
						let adminMessageData = {
							date: datumHeuteL,
							personSenderID: 0,
							personReceiverID: trainerMailList[i].id,
							subject: messageSubject,
							body: adminMessagetext,
							read: false
						}

						await asyncAPI('post', adminMessageData, 'messages');	
					}

				} else {
					toastr.error('Es ist ein Fehler bei der Buchung aufgetreten.', 'Fehler bei der Buchung');
					return false;
				}

			}
		
		}

    });

}