/**
 * SuperEdu Frontend Elemente
 **/

const elementFENavbar = `
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
    <div class="container">
      <a class="navbar-brand" href="#"<strong>KURSI</strong>&nbsp;<img src="dist/img/logo.png" width="20px">&nbsp;KURSINSTITUT</a>
    </div>
  </nav>
  `

const elementFEJumbotron = `
    <!-- Jumbotron Header -->
    <header class="jumbotron my-4">
      <h1 class="display-5">Herzlich Willkommen bei KURSI, dem Kursinstitut!</h1>
      <p class="lead">Mehr als 5 Kurse, Seminare und Lehrgänge – und damit genauso viele Wege, um sich zu entwickeln. Als einer der kleinsten Anbieter für berufliche Aus- und Weiterbildung ist KURSI der optimale Begleiter beim lebenslangen Lernen.</p>
    </header>
    `

const elementFECourseArea = `
	<div class="container">
		<div class="row" id="teaser">

				<!-- Hier werden die Teaser eingefügt -->

		</div>
	</div>
	`

const elementFEFooterJumbotron = `
    <!-- Jumbotron Footer -->
    <header class="jumbotron my-4">
      <h3 class="display-5">Jetzt buchen!</h3>
      <p class="lead">Das berufliche Know-how vertiefen oder eine ganz neue Richtung einschlagen? Den Grundstein legen. Berufliche Laufbahnen nehmen die unterschiedlichsten Wege. Doch eines ist ihnen allen gemein: Sie profitieren von einer soliden Basis.</p>
    </header>
    `

const elementFEFooter = `
  <footer class="py-5 bg-primary">
    <div class="container">
      <p class="m-0 text-center text-white">Copyright &copy; KURSI, das Kursinstitut</p>
    </div>
    <!-- /.container -->
  </footer>
`

const elementFEDetailsSideNav = `
      <div class="col-lg-3">
        <h1 class="my-4">Shop Name</h1>
        <div class="list-group">
          <a href="#" class="list-group-item active">Category 1</a>
          <a href="#" class="list-group-item">Category 2</a>
          <a href="#" class="list-group-item">Category 3</a>
        </div>
      </div>
    `

const elementCourseDetailsModal = `
<div class="modal fade" id="CourseDetailsModal">
	<div class="modal-dialog modal-dialog-scrollable modal-lg">
	  <div class="modal-content">
		<div class="modal-header">
		  <h4 class="modal-title">Kursdetails</h4>
		  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
			<span aria-hidden="true">&times;</span>
		  </button>
		</div>
		<div class="modal-body">
			<div id="kurstitel">
		
			</div>
		
			<h3>Kurstermine</h3>

			<table class="table table-striped">
				<thead>
					<tr>
						<th width="25%">Termine</th><th width="25%">Ort</th><th width="20%">Trainer</th><th width="10%">Plätze</th><th width="20%">Optionen</th>
					</tr>
				</thead>
			
				<tbody id="kurstabelle">
	
				</tbody>

			</table>

		
			<div id="kursdetails">

			</div>
		</div>
		<div class="modal-footer text-center">
		  <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Schließen</button>
		</div>
	  </div>
	  <!-- /.modal-content -->
	</div>
	<!-- /.modal-dialog -->
</div>
<!-- /.modal -->
`

const elementBookingModal = `
<div class="modal fade" id="bookingModal">
	<div class="modal-dialog modal-dialog-scrollable modal-lg">
	  <div class="modal-content">
		<div class="modal-header">
		  <a href="#" data-dismiss="modal" aria-label="Close" class="btn btn-outline-secondary" data-toggle="modal" data-target="#CourseDetailsModal">« Zurück zu den Kursdetails</a>
		  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
			<span aria-hidden="true">&times;</span>
		  </button>
		</div>
		<div class="modal-body">
			<h3>Ihre Kursbuchung</h3>
		
			<div id="buchendetails">
		
			</div>
		
			<h4>Ihre Anmeldeinformationen</h4>
			<p><strong>Bitte geben Sie Ihre Daten ein, um die Buchung abzuschließen. Beachten Sie bitte, dass Pflichtfelder mit <sup>*</sup> gekennzeichnet sind.</strong></p>
			<div id="anmeldeformular">
			
			</div>
		</div>

	  </div>
	  <!-- /.modal-content -->
	</div>
	<!-- /.modal-dialog -->
</div>
<!-- /.modal -->
`

const anmeldeformular = `
<form id="formSMTPMailer" action="#" method="post">
  <div class="form-group row">
	<label for="smtpmailerFirstname" class="col-sm-3 col-form-label text-right">Vorname:<sup>*</sup></label>
	<div class="col-sm-5">
		<input type="text" class="form-control" id="smtpmailerFirstname" name="firstname" required>
	</div>
  </div>
  <div class="form-group row">
	<label for="smtpmailerLastname" class="col-sm-3 col-form-label text-right">Nachname:<sup>*</sup></label>
	<div class="col-sm-5">
		<input type="text" class="form-control" id="smtpmailerLastname" name="lastname" required>
	</div>
  </div>
  <div class="form-group row">
	<label for="smtpmailerTo" class="col-sm-3 col-form-label text-right">Email-Adresse:<sup>*</sup></label>
	<div class="col-sm-5">
		<input type="email" class="form-control" id="smtpmailerTo" name="to" required>
	</div>
  </div>
  <div class="form-group row">
	<label for="smtpmailerPhone" class="col-sm-3 col-form-label text-right">Telefonnummer:</label>
	<div class="col-sm-5">
		<input type="text" class="form-control" id="smtpmailerPhone" name="phone">
	</div>
  </div>
  <div class="form-group row">
	<label for="smtpmailerStreet" class="col-sm-3 col-form-label text-right">Wohnadresse:</label>
	<div class="col-sm-5">
		<input type="text" class="form-control" id="smtpmailerStreet" name="street">
	</div>
  </div>
  <div class="form-group row">
	<label for="smtpmailerZipCode" class="col-sm-3 col-form-label text-right">Postleitzahl:</label>
	<div class="col-sm-5">
		<input type="text" class="form-control" id="smtpmailerZipCode" name="zipCode">
	</div>
  </div>
  <div class="form-group row">
	<label for="smtpmailerCity" class="col-sm-3 col-form-label text-right">Ort:</label>
	<div class="col-sm-5">
		<input type="text" class="form-control" id="smtpmailerCity" name="city">
	</div>
  </div>
  <button type="submit" class="btn btn-primary" id="buttonSMTPMailer">Kurs buchen</button>
  <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Abbrechen</button>
</form>
`





