const SUPABASE_URL =
  'https://rztfwdkjfsosxerretsm.supabase.co';


const SUPABASE_KEY =
  'sb_publishable_6Lw7wYyAbXwnpGvTz_a82g_WzfJd95J';


const supabaseClient =
  supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );

const loginPage =
  document.getElementById(
    'loginPage'
  );


const appShell =
  document.getElementById(
    'appShell'
  );


const loginForm =
  document.getElementById(
    'loginForm'
  );


const loginEmail =
  document.getElementById(
    'loginEmail'
  );


const loginPassword =
  document.getElementById(
    'loginPassword'
  );


const loginBtn =
  document.getElementById(
    'loginBtn'
  );


const loginMessage =
  document.getElementById(
    'loginMessage'
  );


const logoutBtn =
  document.getElementById(
    'logoutBtn'
  );


const currentUserEmail =
  document.getElementById(
    'currentUserEmail'
  );



/* ======================================================
   AUTH
====================================================== */

async function checkSession() {

  const {
    data,
    error
  } =
    await supabaseClient
      .auth
      .getSession();


  if (error) {

    console.error(
      'Session error:',
      error
    );

  }


  const session =
    data?.session;


  if (session) {

    showApplication(
      session.user
    );

  } else {

    showLogin();

  }

}



function showLogin() {

  loginPage
    .classList
    .remove(
      'hidden'
    );


  appShell
    .classList
    .add(
      'hidden'
    );

}



function showApplication(
  user
) {

  loginPage
    .classList
    .add(
      'hidden'
    );


  appShell
    .classList
    .remove(
      'hidden'
    );


  currentUserEmail.textContent =
    user.email || '-';

}



async function login(
  event
) {

  event.preventDefault();


  loginMessage
    .classList
    .remove(
      'show'
    );


  const email =
    loginEmail
      .value
      .trim();


  const password =
    loginPassword
      .value;


  if (
    !email
    ||
    !password
  ) {

    showLoginError(
      'ایمیل و رمز عبور را وارد کنید.'
    );

    return;

  }


  loginBtn.disabled =
    true;


  loginBtn.textContent =
    'در حال ورود...';


  try {

    const {
      data,
      error
    } =
      await supabaseClient
        .auth
        .signInWithPassword({

          email,

          password

        });


    if (error) {
      throw error;
    }


    showApplication(
      data.user
    );


    loginPassword.value =
      '';

  }

  catch (
    error
  ) {

    console.error(
      error
    );


    showLoginError(
      'ایمیل یا رمز عبور صحیح نیست.'
    );

  }

  finally {

    loginBtn.disabled =
      false;


    loginBtn.textContent =
      'ورود';

  }

}



async function logout() {

  const {
    error
  } =
    await supabaseClient
      .auth
      .signOut();


  if (error) {

    console.error(
      error
    );

    return;

  }


  showLogin();


  loginPassword.value =
    '';

}



function showLoginError(
  text
) {

  loginMessage.textContent =
    text;


  loginMessage
    .classList
    .add(
      'show'
    );

}



loginForm.addEventListener(
  'submit',
  login
);


logoutBtn.addEventListener(
  'click',
  logout
);



supabaseClient
  .auth
  .onAuthStateChange(
    (
      event,
      session
    ) => {

      if (
        session?.user
      ) {

        showApplication(
          session.user
        );

      } else {

        showLogin();

      }

    }
  );

let participantCount = 0;

let actionCount = 0;

let archiveMeetings = [];



/* ======================================================
   ELEMENTS
====================================================== */

const formTabBtn =
  document.getElementById('formTabBtn');

const archiveTabBtn =
  document.getElementById('archiveTabBtn');

const formPage =
  document.getElementById('formPage');

const archivePage =
  document.getElementById('archivePage');


const participantsContainer =
  document.getElementById(
    'participantsContainer'
  );

const actionsContainer =
  document.getElementById(
    'actionsContainer'
  );

const signaturesContainer =
  document.getElementById(
    'signaturesContainer'
  );


const addParticipantBtn =
  document.getElementById(
    'addParticipantBtn'
  );

const addActionBtn =
  document.getElementById(
    'addActionBtn'
  );

const saveBtn =
  document.getElementById(
    'saveBtn'
  );

const message =
  document.getElementById(
    'message'
  );


const searchInput =
  document.getElementById(
    'searchInput'
  );

const statusFilter =
  document.getElementById(
    'statusFilter'
  );

const refreshArchiveBtn =
  document.getElementById(
    'refreshArchiveBtn'
  );

const meetingsContainer =
  document.getElementById(
    'meetingsContainer'
  );


const archiveLoading =
  document.getElementById(
    'archiveLoading'
  );

const archiveError =
  document.getElementById(
    'archiveError'
  );

const archiveEmpty =
  document.getElementById(
    'archiveEmpty'
  );


const totalMeetings =
  document.getElementById(
    'totalMeetings'
  );

const approvedMeetings =
  document.getElementById(
    'approvedMeetings'
  );

const pendingMeetings =
  document.getElementById(
    'pendingMeetings'
  );

const totalActions =
  document.getElementById(
    'totalActions'
  );


const detailModal =
  document.getElementById(
    'detailModal'
  );

const closeDetailBtn =
  document.getElementById(
    'closeDetailBtn'
  );

const detailTitle =
  document.getElementById(
    'detailTitle'
  );

const detailContent =
  document.getElementById(
    'detailContent'
  );



/* ======================================================
   TABS
====================================================== */

function openFormTab() {

  formTabBtn.classList.add('active');

  archiveTabBtn.classList.remove('active');

  formPage.classList.add('active');

  archivePage.classList.remove('active');

}


async function openArchiveTab() {

  archiveTabBtn.classList.add('active');

  formTabBtn.classList.remove('active');

  archivePage.classList.add('active');

  formPage.classList.remove('active');

  await loadArchive();

}



/* ======================================================
   PARTICIPANTS
====================================================== */

function addParticipant() {

  participantCount++;

  const id =
    String(participantCount);


  const row =
    document.createElement('div');


  row.className =
    'participant-row';


  row.dataset.id =
    id;


  row.innerHTML = `

    <div class="row-number">
      ${getParticipantRows().length + 1}
    </div>


    <input
      class="participant-name"
      type="text"
      placeholder="نام و نام خانوادگی"
    >


    <input
      class="participant-position"
      type="text"
      placeholder="سمت / واحد"
    >


    <input
      class="participant-contact"
      type="text"
      placeholder="شماره تماس یا ایمیل"
    >


    <button
      class="delete-btn"
      type="button"
    >
      ×
    </button>

  `;


  participantsContainer
    .appendChild(row);


  row
    .querySelector(
      '.participant-name'
    )
    .addEventListener(
      'input',
      () =>
        updateParticipantReferences(id)
    );


  row
    .querySelector(
      '.participant-position'
    )
    .addEventListener(
      'input',
      () =>
        updateParticipantReferences(id)
    );


  row
    .querySelector(
      '.delete-btn'
    )
    .addEventListener(
      'click',
      () =>
        removeParticipant(id)
    );


  createSignatureBox(id);

  refreshActionOwners();

  refreshParticipantNumbers();

}



function removeParticipant(id) {

  document
    .querySelector(
      `.participant-row[data-id="${id}"]`
    )
    ?.remove();


  document
    .querySelector(
      `.signature-box[data-participant-id="${id}"]`
    )
    ?.remove();


  refreshActionOwners();

  refreshParticipantNumbers();

}



function getParticipantRows() {

  return Array.from(
    document.querySelectorAll(
      '.participant-row'
    )
  );

}



function getParticipants() {

  return getParticipantRows().map(
    row => ({

      temp_id:
        row.dataset.id,

      full_name:
        row
          .querySelector(
            '.participant-name'
          )
          .value
          .trim(),

      position:
        row
          .querySelector(
            '.participant-position'
          )
          .value
          .trim(),

      contact:
        row
          .querySelector(
            '.participant-contact'
          )
          .value
          .trim()

    })
  );

}



function refreshParticipantNumbers() {

  getParticipantRows().forEach(
    (row, index) => {

      row.querySelector(
        '.row-number'
      ).textContent =
        index + 1;

    }
  );

}



function updateParticipantReferences(id) {

  const row =
    document.querySelector(
      `.participant-row[data-id="${id}"]`
    );


  if (!row) return;


  const name =
    row
      .querySelector(
        '.participant-name'
      )
      .value
      .trim();


  const position =
    row
      .querySelector(
        '.participant-position'
      )
      .value
      .trim();


  const signatureBox =
    document.querySelector(
      `.signature-box[data-participant-id="${id}"]`
    );


  if (signatureBox) {

    signatureBox
      .querySelector(
        '.signature-name'
      )
      .textContent =
        name || 'فرد بدون نام';


    signatureBox
      .querySelector(
        '.signature-position'
      )
      .textContent =
        position || 'سمت وارد نشده';

  }


  refreshActionOwners();

}



/* ======================================================
   ACTIONS
====================================================== */

function addAction() {

  actionCount++;

  const id =
    String(actionCount);


  const row =
    document.createElement('div');


  row.className =
    'action-row';


  row.dataset.id =
    id;


  row.innerHTML = `

    <div class="action-card-header">

      <div class="row-number">
        ${getActionRows().length + 1}
      </div>

      <button
        class="delete-btn"
        type="button"
      >
        ×
      </button>

    </div>


    <div class="action-main-field">

      <label>
        شرح مصوبه / تعهد
      </label>

      <input
        class="action-title"
        type="text"
        placeholder="شرح مصوبه یا تعهد را وارد کنید"
      >

    </div>


    <div class="action-fields-grid">


      <div class="field-block">

        <label>
          مسئول
        </label>

        <select class="action-owner">

          <option value="">
            انتخاب مسئول
          </option>

        </select>

      </div>


      <div class="field-block">

        <label>
          مهلت انجام
        </label>

        <input
          class="action-date"
          type="date"
        >

      </div>


      <div class="field-block">

        <label>
          وضعیت
        </label>

        <select class="action-status">

          <option value="pending">
            انجام نشده
          </option>

          <option value="in_progress">
            در حال انجام
          </option>

          <option value="completed">
            انجام شده
          </option>

          <option value="cancelled">
            لغو شده
          </option>

        </select>

      </div>


    </div>

  `;


  actionsContainer
    .appendChild(row);


  row
    .querySelector(
      '.delete-btn'
    )
    .addEventListener(
      'click',
      () =>
        removeAction(id)
    );


  refreshActionOwners();

  refreshActionNumbers();

}



function removeAction(id) {

  document
    .querySelector(
      `.action-row[data-id="${id}"]`
    )
    ?.remove();


  refreshActionNumbers();

}



function getActionRows() {

  return Array.from(
    document.querySelectorAll(
      '.action-row'
    )
  );

}



function refreshActionNumbers() {

  getActionRows().forEach(
    (row, index) => {

      row.querySelector(
        '.row-number'
      ).textContent =
        index + 1;

    }
  );

}



function refreshActionOwners() {

  const participants =
    getParticipants();


  document
    .querySelectorAll(
      '.action-owner'
    )
    .forEach(
      select => {

        const current =
          select.value;


        select.innerHTML =
          '<option value="">انتخاب مسئول</option>';


        participants.forEach(
          person => {

            const option =
              document.createElement(
                'option'
              );


            option.value =
              person.temp_id;


            option.textContent =
              person.full_name
              ||
              `فرد ${person.temp_id}`;


            select.appendChild(option);

          }
        );


        if (
          participants.some(
            person =>
              person.temp_id === current
          )
        ) {

          select.value =
            current;

        }

      }
    );

}



/* ======================================================
   SIGNATURES
====================================================== */

function createSignatureBox(id) {

  const box =
    document.createElement('div');


  box.className =
    'signature-box';


  box.dataset.participantId =
    id;


  box.innerHTML = `

    <div class="signature-person">

      <div>

        <h3 class="signature-name">
          فرد بدون نام
        </h3>

        <div class="signature-position">
          سمت وارد نشده
        </div>

      </div>


      <span class="signature-status">
        در انتظار امضا
      </span>

    </div>


    <canvas
      class="signature-canvas"
      width="700"
      height="220"
    ></canvas>


    <p class="signature-hint">
      داخل کادر امضا کنید.
    </p>


    <button
      class="clear-signature-btn"
      type="button"
    >
      پاک کردن امضا
    </button>

  `;


  signaturesContainer
    .appendChild(box);


  const canvas =
    box.querySelector(
      '.signature-canvas'
    );


  setupSignatureCanvas(
    canvas,
    box
  );


  box
    .querySelector(
      '.clear-signature-btn'
    )
    .addEventListener(
      'click',
      () =>
        clearSignature(
          canvas,
          box
        )
    );

}



function setupSignatureCanvas(
  canvas,
  box
) {

  const ctx =
    canvas.getContext('2d');


  ctx.lineWidth = 2.5;

  ctx.lineCap = 'round';

  ctx.strokeStyle = '#111827';


  let drawing = false;


  function position(event) {

    const rect =
      canvas
        .getBoundingClientRect();


    const source =
      event.touches
      ?
      event.touches[0]
      :
      event;


    return {

      x:
        (
          source.clientX -
          rect.left
        )
        *
        (
          canvas.width /
          rect.width
        ),

      y:
        (
          source.clientY -
          rect.top
        )
        *
        (
          canvas.height /
          rect.height
        )

    };

  }


  function start(event) {

    drawing = true;

    const pos =
      position(event);

    ctx.beginPath();

    ctx.moveTo(
      pos.x,
      pos.y
    );

    event.preventDefault();

  }


  function move(event) {

    if (!drawing) return;


    const pos =
      position(event);


    ctx.lineTo(
      pos.x,
      pos.y
    );


    ctx.stroke();


    canvas.dataset
      .hasSignature =
        'true';


    box
      .querySelector(
        '.signature-status'
      )
      .textContent =
        'امضا ثبت شده';


    event.preventDefault();

  }


  function stop() {

    drawing = false;

  }


  canvas.addEventListener(
    'mousedown',
    start
  );

  canvas.addEventListener(
    'mousemove',
    move
  );

  window.addEventListener(
    'mouseup',
    stop
  );


  canvas.addEventListener(
    'touchstart',
    start,
    {
      passive: false
    }
  );

  canvas.addEventListener(
    'touchmove',
    move,
    {
      passive: false
    }
  );

  canvas.addEventListener(
    'touchend',
    stop
  );

}



function clearSignature(
  canvas,
  box
) {

  canvas
    .getContext('2d')
    .clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );


  canvas.dataset
    .hasSignature =
      'false';


  box
    .querySelector(
      '.signature-status'
    )
    .textContent =
      'در انتظار امضا';

}



/* ======================================================
   COLLECT FORM
====================================================== */

function collectMeetingData() {

  const participants =
    getParticipants();


  const actions =
    getActionRows().map(
      row => ({

        title:
          row
            .querySelector(
              '.action-title'
            )
            .value
            .trim(),

        owner_temp_id:
          row
            .querySelector(
              '.action-owner'
            )
            .value,

        due_date:
          row
            .querySelector(
              '.action-date'
            )
            .value,

        status:
          row
            .querySelector(
              '.action-status'
            )
            .value

      })
    );


  const signatures =
    Array.from(
      document.querySelectorAll(
        '.signature-box'
      )
    )
    .map(
      box => {

        const canvas =
          box.querySelector(
            '.signature-canvas'
          );


        const signed =
          canvas.dataset
            .hasSignature ===
          'true';


        return {

          participant_temp_id:
            box.dataset
              .participantId,

          signed,

          image:
            signed
            ?
            canvas.toDataURL(
              'image/png'
            )
            :
            null

        };

      }
    );


  return {

    meeting_number:
      document
        .getElementById(
          'meetingNumber'
        )
        .value
        .trim(),

    meeting_date:
      document
        .getElementById(
          'meetingDate'
        )
        .value,

    meeting_time:
      document
        .getElementById(
          'meetingTime'
        )
        .value,

    location:
      document
        .getElementById(
          'meetingLocation'
        )
        .value
        .trim(),

    title:
      document
        .getElementById(
          'meetingTitle'
        )
        .value
        .trim(),

    description:
      document
        .getElementById(
          'meetingDescription'
        )
        .value
        .trim(),

    participants,

    actions,

    signatures

  };

}



/* ======================================================
   BLOB
====================================================== */

function dataURLToBlob(
  dataURL
) {

  const parts =
    dataURL.split(',');


  const binary =
    atob(parts[1]);


  const bytes =
    new Uint8Array(
      binary.length
    );


  for (
    let i = 0;
    i < binary.length;
    i++
  ) {

    bytes[i] =
      binary.charCodeAt(i);

  }


  return new Blob(
    [bytes],
    {
      type: 'image/png'
    }
  );

}



/* ======================================================
   SAVE MEETING
====================================================== */

async function saveMeeting() {

  const data =
    collectMeetingData();


  if (!data.title) {

    showMessage(
      'موضوع جلسه را وارد کنید.',
      true
    );

    return;

  }


  const participants =
    data.participants
      .filter(
        person =>
          person.full_name
      );


  if (!participants.length) {

    showMessage(
      'حداقل یک حاضر وارد کنید.',
      true
    );

    return;

  }


  saveBtn.disabled = true;

  saveBtn.textContent =
    'در حال ثبت...';


  try {

    /* Meeting */

    const {
      data: meeting,
      error: meetingError
    } =
      await supabaseClient
        .from('meetings')
        .insert({

          meeting_number:
            data.meeting_number
            || null,

          meeting_date:
            data.meeting_date
            || null,

          meeting_time:
            data.meeting_time
            || null,

          location:
            data.location
            || null,

          title:
            data.title,

          description:
            data.description
            || null,

          status:
            'draft'

        })
        .select()
        .single();


    if (meetingError) {
      throw meetingError;
    }


    /* Participants */

    const participantPayload =
      participants.map(
        person => {

          let email = null;
          let phone = null;


          if (
            person.contact
              .includes('@')
          ) {

            email =
              person.contact;

          } else if (
            person.contact
          ) {

            phone =
              person.contact;

          }


          return {

            temp_id:
              person.temp_id,

            data: {

              meeting_id:
                meeting.id,

              full_name:
                person.full_name,

              position:
                person.position
                || null,

              email,

              phone,

              attendance_status:
                'present',

              approval_status:
                'pending'

            }

          };

        }
      );


    const {
      data: insertedParticipants,
      error: participantsError
    } =
      await supabaseClient
        .from(
          'meeting_participants'
        )
        .insert(
          participantPayload
            .map(
              item =>
                item.data
            )
        )
        .select();


    if (participantsError) {
      throw participantsError;
    }


    const participantMap = {};


    participantPayload.forEach(
      (item, index) => {

        participantMap[
          item.temp_id
        ] =
          insertedParticipants[
            index
          ].id;

      }
    );


    /* Actions */

    const actions =
      data.actions.filter(
        action =>
          action.title
      );


    if (actions.length) {

      const {
        error
      } =
        await supabaseClient
          .from(
            'meeting_actions'
          )
          .insert(
            actions.map(
              action => ({

                meeting_id:
                  meeting.id,

                title:
                  action.title,

                owner_participant_id:
                  action.owner_temp_id
                  ?
                  participantMap[
                    action.owner_temp_id
                  ]
                  :
                  null,

                due_date:
                  action.due_date
                  || null,

                status:
                  action.status

              })
            )
          );


      if (error) {
        throw error;
      }

    }


    /* Signatures */

    const signed =
      data.signatures
        .filter(
          item =>
            item.signed
            &&
            item.image
        );


    for (
      let i = 0;
      i < signed.length;
      i++
    ) {

      const signature =
        signed[i];


      const participantId =
        participantMap[
          signature
            .participant_temp_id
        ];


      if (!participantId) {
        continue;
      }


      const path =
        `${meeting.id}/${participantId}-${Date.now()}-${i}.png`;


      const {
        error: storageError
      } =
        await supabaseClient
          .storage
          .from('signatures')
          .upload(
            path,
            dataURLToBlob(
              signature.image
            ),
            {
              contentType:
                'image/png'
            }
          );


      if (storageError) {
        throw storageError;
      }


      const {
        error: signatureError
      } =
        await supabaseClient
          .from(
            'meeting_signatures'
          )
          .insert({

            meeting_id:
              meeting.id,

            participant_id:
              participantId,

            signature_path:
              path,

            approved:
              true,

            signed_at:
              new Date()
                .toISOString(),

            meeting_version:
              meeting.version
              || 1

          });


      if (signatureError) {
        throw signatureError;
      }


      await supabaseClient
        .from(
          'meeting_participants'
        )
        .update({

          approval_status:
            'approved'

        })
        .eq(
          'id',
          participantId
        );

    }


    const allSigned =
      participants.every(
        person =>
          signed.some(
            signature =>
              signature
                .participant_temp_id
              ===
              person.temp_id
          )
      );


    if (allSigned) {

      await supabaseClient
        .from('meetings')
        .update({

          status:
            'approved'

        })
        .eq(
          'id',
          meeting.id
        );

    }


    await supabaseClient
      .from('audit_logs')
      .insert({

        meeting_id:
          meeting.id,

        action:
          'meeting_created',

        metadata: {

          participants_count:
            participants.length,

          actions_count:
            actions.length,

          signatures_count:
            signed.length

        }

      });


    showMessage(
      'صورتجلسه با موفقیت ثبت شد.',
      false
    );


    setTimeout(
      () => {

        openArchiveTab();

      },
      900
    );

  }

  catch (error) {

    console.error(error);


    showMessage(
      'خطا: '
      +
      (
        error.message
        ||
        'خطای نامشخص'
      ),
      true
    );

  }

  finally {

    saveBtn.disabled =
      false;


    saveBtn.textContent =
      'ثبت صورتجلسه';

  }

}



/* ======================================================
   MESSAGE
====================================================== */

function showMessage(
  text,
  error
) {

  message.textContent =
    text;


  message.classList.add(
    'show'
  );


  if (error) {

    message.style.background =
      '#fef3f2';

    message.style.color =
      '#b42318';

  } else {

    message.style.background =
      '#ecfdf3';

    message.style.color =
      '#027a48';

  }

}



/* ======================================================
   ARCHIVE
====================================================== */

async function loadArchive() {

  archiveLoading
    .classList.add(
      'show'
    );


  archiveEmpty
    .classList.remove(
      'show'
    );


  archiveError
    .classList.remove(
      'show'
    );


  meetingsContainer.innerHTML =
    '';


  try {

    const [
      meetingsResult,
      participantsResult,
      actionsResult,
      signaturesResult
    ] =
      await Promise.all([

        supabaseClient
          .from('meetings')
          .select('*')
          .order(
            'created_at',
            {
              ascending: false
            }
          ),

        supabaseClient
          .from(
            'meeting_participants'
          )
          .select(
            'id,meeting_id'
          ),

        supabaseClient
          .from(
            'meeting_actions'
          )
          .select(
            'id,meeting_id'
          ),

        supabaseClient
          .from(
            'meeting_signatures'
          )
          .select(
            'id,meeting_id,approved'
          )

      ]);


    if (meetingsResult.error) {
      throw meetingsResult.error;
    }


    archiveMeetings =
      meetingsResult.data.map(
        meeting => {

          const participantCount =
            participantsResult
              .data
              .filter(
                item =>
                  item.meeting_id
                  ===
                  meeting.id
              )
              .length;


          const actionCount =
            actionsResult
              .data
              .filter(
                item =>
                  item.meeting_id
                  ===
                  meeting.id
              )
              .length;


          const signatureCount =
            signaturesResult
              .data
              .filter(
                item =>
                  item.meeting_id
                  ===
                  meeting.id
                  &&
                  item.approved
              )
              .length;


          return {

            ...meeting,

            participantCount,

            actionCount,

            signatureCount

          };

        }
      );


    updateSummary();

    applyArchiveFilters();

  }

  catch (error) {

    archiveError.textContent =
      error.message;


    archiveError
      .classList.add(
        'show'
      );

  }

  finally {

    archiveLoading
      .classList.remove(
        'show'
      );

  }

}



function updateSummary() {

  totalMeetings.textContent =
    archiveMeetings.length;


  approvedMeetings.textContent =
    archiveMeetings.filter(
      item =>
        item.status ===
        'approved'
        ||
        item.status ===
        'locked'
    ).length;


  pendingMeetings.textContent =
    archiveMeetings.filter(
      item =>
        item.status !==
        'approved'
        &&
        item.status !==
        'locked'
    ).length;


  totalActions.textContent =
    archiveMeetings.reduce(
      (
        total,
        item
      ) =>
        total +
        item.actionCount,
      0
    );

}



function applyArchiveFilters() {

  const search =
    searchInput.value
      .trim()
      .toLowerCase();


  const status =
    statusFilter.value;


  const filtered =
    archiveMeetings.filter(
      meeting => {

        const matchesSearch =
          !search
          ||
          (
            meeting.title
            ||
            ''
          )
          .toLowerCase()
          .includes(search)
          ||
          (
            meeting.meeting_number
            ||
            ''
          )
          .toLowerCase()
          .includes(search);


        const matchesStatus =
          status ===
          'all'
          ||
          meeting.status ===
          status;


        return (
          matchesSearch
          &&
          matchesStatus
        );

      }
    );


  renderMeetings(filtered);

}



function renderMeetings(
  meetings
) {

  meetingsContainer.innerHTML =
    '';


  archiveEmpty
    .classList.remove(
      'show'
    );


  if (!meetings.length) {

    archiveEmpty
      .classList.add(
        'show'
      );

    return;

  }


  meetings.forEach(
    meeting => {

      const card =
        document.createElement(
          'article'
        );


      card.className =
        'meeting-card';


      const progress =
        meeting.participantCount
        ?
        Math.round(
          meeting.signatureCount
          /
          meeting.participantCount
          *
          100
        )
        :
        0;


      const status =
        getStatusInfo(
          meeting.status
        );


      card.innerHTML = `

        <div class="meeting-card-top">

          <div>

            <div class="meeting-number">

              ${
                escapeHtml(
                  meeting.meeting_number
                  ||
                  'بدون شماره'
                )
              }

            </div>


            <h3>

              ${
                escapeHtml(
                  meeting.title
                )
              }

            </h3>


            <div class="meeting-meta">

              ${
                formatDate(
                  meeting.meeting_date
                )
              }

              ${
                meeting.meeting_time
                ?
                ' · '
                +
                meeting.meeting_time
                  .slice(0,5)
                :
                ''
              }

            </div>

          </div>


          <span
            class="archive-status ${status.className}"
          >

            ${status.label}

          </span>

        </div>


        <div class="meeting-stats">

          <div class="stat-item">

            <span>
              حاضرین
            </span>

            <strong>
              ${meeting.participantCount}
            </strong>

          </div>


          <div class="stat-item">

            <span>
              تعهدات
            </span>

            <strong>
              ${meeting.actionCount}
            </strong>

          </div>


          <div class="stat-item">

            <span>
              امضا
            </span>

            <strong>

              ${meeting.signatureCount}
              /
              ${meeting.participantCount}

            </strong>

          </div>

        </div>


        <div class="progress-area">

          <div class="progress-title">

            <span>
              تکمیل امضاها
            </span>

            <span>
              ${progress}٪
            </span>

          </div>


          <div class="progress-track">

            <div
              class="progress-bar"
              style="width:${Math.min(
                progress,
                100
              )}%"
            >
            </div>

          </div>

        </div>


        <div class="meeting-card-footer">

          <button
            class="detail-btn"
            type="button"
            data-id="${meeting.id}"
          >
            مشاهده جزئیات
          </button>

        </div>

      `;


      card
        .querySelector(
          '.detail-btn'
        )
        .addEventListener(
          'click',
          () =>
            openMeetingDetail(
              meeting.id
            )
        );


      meetingsContainer
        .appendChild(card);

    }
  );

}



/* ======================================================
   MEETING DETAIL
====================================================== */

async function openMeetingDetail(
  meetingId
) {

  detailModal
    .classList.add(
      'show'
    );


  detailTitle.textContent =
    'در حال دریافت...';


  detailContent.innerHTML =
    'در حال دریافت اطلاعات...';


  try {

    const [
      meetingResult,
      participantsResult,
      actionsResult,
      signaturesResult
    ] =
      await Promise.all([

        supabaseClient
          .from('meetings')
          .select('*')
          .eq(
            'id',
            meetingId
          )
          .single(),

        supabaseClient
          .from(
            'meeting_participants'
          )
          .select('*')
          .eq(
            'meeting_id',
            meetingId
          ),

        supabaseClient
          .from(
            'meeting_actions'
          )
          .select('*')
          .eq(
            'meeting_id',
            meetingId
          ),

        supabaseClient
          .from(
            'meeting_signatures'
          )
          .select('*')
          .eq(
            'meeting_id',
            meetingId
          )

      ]);


    if (meetingResult.error) {
      throw meetingResult.error;
    }


    const meeting =
      meetingResult.data;


    const participants =
      participantsResult.data || [];


    const actions =
      actionsResult.data || [];


    const signatures =
      signaturesResult.data || [];


    const participantMap = {};


    participants.forEach(
      person => {

        participantMap[
          person.id
        ] =
          person;

      }
    );


    detailTitle.textContent =
      meeting.title;


    let signaturesHTML = '';


    for (
      const signature
      of signatures
    ) {

      let imageURL = null;


      const {
        data
      } =
        await supabaseClient
          .storage
          .from(
            'signatures'
          )
          .createSignedUrl(
            signature.signature_path,
            3600
          );


      if (data) {
        imageURL =
          data.signedUrl;
      }


      const person =
        participantMap[
          signature.participant_id
        ];


      signaturesHTML += `

        <div class="saved-signature">

          <strong>
            ${
              escapeHtml(
                person
                ?
                person.full_name
                :
                'نامشخص'
              )
            }
          </strong>


          ${
            imageURL
            ?
            `
            <img
              src="${imageURL}"
              alt="امضا"
            >
            `
            :
            '<p>تصویر امضا در دسترس نیست.</p>'
          }

        </div>

      `;

    }


    const actionsHTML =
      actions.length
      ?
      actions.map(
        action => {

          const owner =
            participantMap[
              action
                .owner_participant_id
            ];


          return `

            <div class="detail-row">

              <strong>
                ${escapeHtml(
                  action.title
                )}
              </strong>

              <div>
                مسئول:
                ${
                  escapeHtml(
                    owner
                    ?
                    owner.full_name
                    :
                    'تعیین نشده'
                  )
                }
              </div>

              <div>
                مهلت:
                ${
                  action.due_date
                  ||
                  '-'
                }
              </div>

            </div>

          `;

        }
      )
      .join('')
      :
      '<p>تعهدی ثبت نشده است.</p>';


    const participantsHTML =
      participants.map(
        person => `

          <div class="detail-row">

            <strong>
              ${escapeHtml(
                person.full_name
              )}
            </strong>

            <div>
              ${
                escapeHtml(
                  person.position
                  ||
                  'بدون سمت'
                )
              }
            </div>

            <div>
              وضعیت تأیید:
              ${
                person.approval_status
                ===
                'approved'
                ?
                'تأیید شده'
                :
                'در انتظار'
              }
            </div>

          </div>

        `
      )
      .join('');


    detailContent.innerHTML = `

      <section class="detail-section">

        <h3>
          اطلاعات جلسه
        </h3>


        <div class="detail-info-grid">

          <div class="detail-info">

            <strong>
              شماره صورتجلسه
            </strong>

            <div>
              ${
                escapeHtml(
                  meeting.meeting_number
                  ||
                  '-'
                )
              }
            </div>

          </div>


          <div class="detail-info">

            <strong>
              تاریخ
            </strong>

            <div>
              ${
                formatDate(
                  meeting.meeting_date
                )
              }
            </div>

          </div>


          <div class="detail-info">

            <strong>
              ساعت
            </strong>

            <div>
              ${
                meeting.meeting_time
                ?
                meeting.meeting_time
                  .slice(0,5)
                :
                '-'
              }
            </div>

          </div>


          <div class="detail-info">

            <strong>
              محل جلسه
            </strong>

            <div>
              ${
                escapeHtml(
                  meeting.location
                  ||
                  '-'
                )
              }
            </div>

          </div>

        </div>

      </section>


      <section class="detail-section">

        <h3>
          شرح جلسه
        </h3>

        <div class="detail-row">

          ${
            escapeHtml(
              meeting.description
              ||
              'شرحی ثبت نشده است.'
            )
          }

        </div>

      </section>


      <section class="detail-section">

        <h3>
          حاضرین
        </h3>

        <div class="detail-list">

          ${participantsHTML}

        </div>

      </section>


      <section class="detail-section">

        <h3>
          مصوبات و تعهدات
        </h3>

        <div class="detail-list">

          ${actionsHTML}

        </div>

      </section>


      <section class="detail-section">

        <h3>
          امضاها
        </h3>

        <div class="detail-signatures">

          ${
            signaturesHTML
            ||
            '<p>امضایی ثبت نشده است.</p>'
          }

        </div>

      </section>

    `;

  }

  catch (error) {

    detailContent.innerHTML =
      'خطا در دریافت اطلاعات: '
      +
      error.message;

  }

}



/* ======================================================
   HELPERS
====================================================== */

function getStatusInfo(
  status
) {

  switch (status) {

    case 'approved':

      return {
        label:
          'تأیید شده',
        className:
          'status-approved'
      };


    case 'locked':

      return {
        label:
          'نهایی',
        className:
          'status-locked'
      };


    case 'waiting_for_signature':

      return {
        label:
          'در انتظار امضا',
        className:
          'status-waiting'
      };


    default:

      return {
        label:
          'پیش‌نویس',
        className:
          'status-draft'
      };

  }

}



function formatDate(value) {

  if (!value) {
    return '-';
  }


  try {

    return new Intl
      .DateTimeFormat(
        'fa-IR',
        {
          year:
            'numeric',
          month:
            'long',
          day:
            'numeric'
        }
      )
      .format(
        new Date(
          value
          +
          'T00:00:00'
        )
      );

  }

  catch {

    return value;

  }

}



function escapeHtml(value) {

  const element =
    document.createElement(
      'div'
    );


  element.textContent =
    String(
      value ?? ''
    );


  return element.innerHTML;

}



/* ======================================================
   EVENTS
====================================================== */

formTabBtn.addEventListener(
  'click',
  openFormTab
);


archiveTabBtn.addEventListener(
  'click',
  openArchiveTab
);


addParticipantBtn.addEventListener(
  'click',
  addParticipant
);


addActionBtn.addEventListener(
  'click',
  addAction
);


saveBtn.addEventListener(
  'click',
  saveMeeting
);


searchInput.addEventListener(
  'input',
  applyArchiveFilters
);


statusFilter.addEventListener(
  'change',
  applyArchiveFilters
);


refreshArchiveBtn.addEventListener(
  'click',
  loadArchive
);


closeDetailBtn.addEventListener(
  'click',
  () =>
    detailModal
      .classList
      .remove('show')
);


detailModal.addEventListener(
  'click',
  event => {

    if (
      event.target ===
      detailModal
    ) {

      detailModal
        .classList
        .remove(
          'show'
        );

    }

  }
);



/* ======================================================
   INITIAL
====================================================== */

addParticipant();

addAction();

checkSession();
