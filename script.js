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

let dashboardActions = [];
let dashboardParticipants = [];
let dashboardMeetings = [];



/* ======================================================
   ELEMENTS
====================================================== */

const formTabBtn =
  document.getElementById('formTabBtn');

const archiveTabBtn =
  document.getElementById('archiveTabBtn');

const tasksTabBtn =
  document.getElementById('tasksTabBtn');

const formPage =
  document.getElementById('formPage');

const archivePage =
  document.getElementById('archivePage');

const tasksPage =
  document.getElementById('tasksPage');


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


const tasksTotal =
  document.getElementById('tasksTotal');

const tasksCompleted =
  document.getElementById('tasksCompleted');

const tasksInProgress =
  document.getElementById('tasksInProgress');

const tasksOverdue =
  document.getElementById('tasksOverdue');

const taskSearchInput =
  document.getElementById('taskSearchInput');

const taskStatusFilter =
  document.getElementById('taskStatusFilter');

const refreshTasksBtn =
  document.getElementById('refreshTasksBtn');

const tasksLoading =
  document.getElementById('tasksLoading');

const tasksError =
  document.getElementById('tasksError');

const tasksEmpty =
  document.getElementById('tasksEmpty');

const tasksPeopleContainer =
  document.getElementById('tasksPeopleContainer');



/* ======================================================
   TABS
====================================================== */

function resetMainTabs() {

  formTabBtn.classList.remove('active');
  archiveTabBtn.classList.remove('active');
  tasksTabBtn.classList.remove('active');

  formPage.classList.remove('active');
  archivePage.classList.remove('active');
  tasksPage.classList.remove('active');

}


function openFormTab() {

  resetMainTabs();

  formTabBtn.classList.add('active');
  formPage.classList.add('active');

}


async function openArchiveTab() {

  resetMainTabs();

  archiveTabBtn.classList.add('active');
  archivePage.classList.add('active');

  await loadArchive();

}


async function openTasksTab() {

  resetMainTabs();

  tasksTabBtn.classList.add('active');
  tasksPage.classList.add('active');

  await loadTasksDashboard();

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
   TASKS DASHBOARD
====================================================== */

async function loadTasksDashboard() {

  tasksLoading.classList.add('show');
  tasksError.classList.remove('show');
  tasksEmpty.classList.remove('show');
  tasksPeopleContainer.innerHTML = '';

  try {

    const [
      actionsResult,
      participantsResult,
      meetingsResult
    ] = await Promise.all([

      supabaseClient
        .from('meeting_actions')
        .select('*')
        .order('due_date', { ascending: true }),

      supabaseClient
        .from('meeting_participants')
        .select('id,meeting_id,full_name,position,email,phone'),

      supabaseClient
        .from('meetings')
        .select('id,title,meeting_number,meeting_date,status')

    ]);

    if (actionsResult.error) throw actionsResult.error;
    if (participantsResult.error) throw participantsResult.error;
    if (meetingsResult.error) throw meetingsResult.error;

    dashboardActions = actionsResult.data || [];
    dashboardParticipants = participantsResult.data || [];
    dashboardMeetings = meetingsResult.data || [];

    updateTasksSummary();
    renderTasksDashboard();

  }
  catch (error) {

    console.error(error);

    tasksError.textContent =
      error.message || 'خطا در دریافت تعهدات.';

    tasksError.classList.add('show');

  }
  finally {

    tasksLoading.classList.remove('show');

  }

}


function isActionOverdue(action) {

  if (!action.due_date) return false;

  if (
    action.status === 'completed'
    ||
    action.status === 'cancelled'
  ) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(
    action.due_date + 'T00:00:00'
  );

  return due < today;

}


function updateTasksSummary() {

  const activeForTotal =
    dashboardActions.filter(
      action =>
        action.status !== 'cancelled'
    );

  tasksTotal.textContent =
    activeForTotal.length;

  tasksCompleted.textContent =
    dashboardActions.filter(
      action =>
        action.status === 'completed'
    ).length;

  tasksInProgress.textContent =
    dashboardActions.filter(
      action =>
        action.status === 'in_progress'
        &&
        !isActionOverdue(action)
    ).length;

  tasksOverdue.textContent =
    dashboardActions.filter(
      isActionOverdue
    ).length;

}


function getDashboardPersonKey(person) {

  if (!person) return 'unassigned';

  if (person.email) {
    return 'email:' + person.email.trim().toLowerCase();
  }

  if (person.phone) {
    return 'phone:' + person.phone.replace(/\s+/g, '');
  }

  return 'name:' +
    (person.full_name || 'نامشخص')
      .trim()
      .toLowerCase();

}


function getActionStatusInfo(action) {

  if (isActionOverdue(action)) {
    return {
      label: 'عقب‌افتاده',
      className: 'task-overdue',
      key: 'overdue'
    };
  }

  switch (action.status) {

    case 'in_progress':
      return {
        label: 'در حال انجام',
        className: 'task-progress',
        key: 'in_progress'
      };

    case 'completed':
      return {
        label: 'انجام شده',
        className: 'task-completed',
        key: 'completed'
      };

    case 'cancelled':
      return {
        label: 'لغو شده',
        className: 'task-cancelled',
        key: 'cancelled'
      };

    default:
      return {
        label: 'انجام نشده',
        className: 'task-pending',
        key: 'pending'
      };

  }

}


function renderTasksDashboard() {

  tasksPeopleContainer.innerHTML = '';
  tasksEmpty.classList.remove('show');

  const participantMap = {};
  dashboardParticipants.forEach(
    person => {
      participantMap[person.id] = person;
    }
  );

  const meetingMap = {};
  dashboardMeetings.forEach(
    meeting => {
      meetingMap[meeting.id] = meeting;
    }
  );

  const search =
    taskSearchInput.value.trim().toLowerCase();

  const statusFilterValue =
    taskStatusFilter.value;

  const groups = {};

  dashboardActions.forEach(
    action => {

      const person =
        participantMap[action.owner_participant_id]
        ||
        null;

      const statusInfo =
        getActionStatusInfo(action);

      if (
        statusFilterValue !== 'all'
        &&
        statusInfo.key !== statusFilterValue
      ) {
        return;
      }

      const searchable = [
        person?.full_name || 'بدون مسئول',
        person?.email || '',
        person?.phone || ''
      ]
      .join(' ')
      .toLowerCase();

      if (
        search
        &&
        !searchable.includes(search)
      ) {
        return;
      }

      const key =
        getDashboardPersonKey(person);

      if (!groups[key]) {

        groups[key] = {
          person,
          actions: []
        };

      }

      groups[key].actions.push({
        ...action,
        meeting: meetingMap[action.meeting_id] || null,
        statusInfo
      });

    }
  );

  const people =
    Object.values(groups)
      .sort(
        (a, b) =>
          (a.person?.full_name || 'بدون مسئول')
            .localeCompare(
              b.person?.full_name || 'بدون مسئول',
              'fa'
            )
      );

  if (!people.length) {
    tasksEmpty.classList.add('show');
    return;
  }

  people.forEach(
    group => {

      const person = group.person;
      const actions = group.actions;

      const completedCount =
        actions.filter(
          item => item.status === 'completed'
        ).length;

      const inProgressCount =
        actions.filter(
          item =>
            item.status === 'in_progress'
            &&
            !isActionOverdue(item)
        ).length;

      const openCount =
        actions.filter(
          item =>
            item.status === 'pending'
            &&
            !isActionOverdue(item)
        ).length;

      const overdueCount =
        actions.filter(
          isActionOverdue
        ).length;

      const details =
        document.createElement('details');

      details.className =
        'person-task-card';

      const contact =
        person
        ?
        (
          person.email
          ||
          person.phone
          ||
          person.position
          ||
          'اطلاعات تماس ثبت نشده'
        )
        :
        'برای این تعهد مسئول تعیین نشده است';

      const actionRows =
        actions.map(
          item => `

            <div class="task-item">

              <div>
                <div class="task-title">
                  ${escapeHtml(item.title)}
                </div>
                <div class="task-meeting">
                  جلسه: ${escapeHtml(item.meeting?.title || '-')}
                  ${
                    item.meeting?.meeting_number
                    ?
                    ' · ' + escapeHtml(item.meeting.meeting_number)
                    :
                    ''
                  }
                </div>
              </div>

              <div class="task-due">
                مهلت: ${formatDate(item.due_date)}
              </div>

              <div class="task-due">
                تاریخ جلسه: ${formatDate(item.meeting?.meeting_date)}
              </div>

              <span class="task-status-chip ${item.statusInfo.className}">
                ${item.statusInfo.label}
              </span>

            </div>

          `
        )
        .join('');

      details.innerHTML = `

        <summary class="person-task-summary">

          <div class="person-identity">
            <strong>
              ${escapeHtml(person?.full_name || 'بدون مسئول')}
            </strong>
            <span>
              ${escapeHtml(contact)}
            </span>
          </div>

          <div class="person-task-stat">
            <span>کل</span>
            <strong>${actions.length}</strong>
          </div>

          <div class="person-task-stat">
            <span>انجام شده</span>
            <strong>${completedCount}</strong>
          </div>

          <div class="person-task-stat">
            <span>باز / در حال انجام</span>
            <strong>${openCount + inProgressCount}</strong>
          </div>

          <div class="person-task-stat">
            <span>عقب‌افتاده</span>
            <strong>${overdueCount}</strong>
          </div>

        </summary>

        <div class="person-task-body">
          ${actionRows}
        </div>

      `;

      tasksPeopleContainer.appendChild(details);

    }
  );

}


/* ======================================================
   MEETING DETAIL
====================================================== */

async function openMeetingDetail(
  meetingId
) {

  detailModal.classList.add('show');
  detailTitle.textContent = 'در حال دریافت...';
  detailContent.innerHTML = 'در حال دریافت اطلاعات...';

  try {

    const [
      meetingResult,
      participantsResult,
      actionsResult,
      signaturesResult
    ] = await Promise.all([

      supabaseClient
        .from('meetings')
        .select('*')
        .eq('id', meetingId)
        .single(),

      supabaseClient
        .from('meeting_participants')
        .select('*')
        .eq('meeting_id', meetingId),

      supabaseClient
        .from('meeting_actions')
        .select('*')
        .eq('meeting_id', meetingId),

      supabaseClient
        .from('meeting_signatures')
        .select('*')
        .eq('meeting_id', meetingId)

    ]);

    if (meetingResult.error) throw meetingResult.error;
    if (participantsResult.error) throw participantsResult.error;
    if (actionsResult.error) throw actionsResult.error;
    if (signaturesResult.error) throw signaturesResult.error;

    const meeting = meetingResult.data;
    const participants = participantsResult.data || [];
    const actions = actionsResult.data || [];
    const signatures = signaturesResult.data || [];

    const participantMap = {};
    participants.forEach(
      person => {
        participantMap[person.id] = person;
      }
    );

    detailTitle.textContent = meeting.title;

    const signatureItems = [];

    for (const signature of signatures) {

      let imageURL = null;

      if (signature.signature_path) {

        const { data, error } =
          await supabaseClient
            .storage
            .from('signatures')
            .createSignedUrl(
              signature.signature_path,
              3600
            );

        if (!error && data) {
          imageURL = data.signedUrl;
        }

      }

      signatureItems.push({
        ...signature,
        imageURL,
        person: participantMap[signature.participant_id] || null
      });

    }

    const approvedSignatureCount =
      signatures.filter(
        item => item.approved
      ).length;

    const allSigned =
      participants.length > 0
      &&
      approvedSignatureCount >= participants.length;

    const statusInfo =
      getStatusInfo(meeting.status);

    const actionsHTML =
      actions.length
      ?
      actions.map(
        action => {

          const owner =
            participantMap[action.owner_participant_id];

          const actionStatus =
            getActionStatusInfo(action);

          return `

            <div class="detail-row">

              <strong>
                ${escapeHtml(action.title)}
              </strong>

              <div>
                مسئول:
                ${escapeHtml(owner?.full_name || 'تعیین نشده')}
              </div>

              <div>
                مهلت:
                ${formatDate(action.due_date)}
              </div>

              <div>
                وضعیت:
                ${actionStatus.label}
              </div>

            </div>

          `;

        }
      ).join('')
      :
      '<p>تعهدی ثبت نشده است.</p>';

    const participantsHTML =
      participants.length
      ?
      participants.map(
        person => `

          <div class="detail-row">

            <strong>
              ${escapeHtml(person.full_name)}
            </strong>

            <div>
              ${escapeHtml(person.position || 'بدون سمت')}
            </div>

            <div>
              ${escapeHtml(person.email || person.phone || '')}
            </div>

            <div>
              وضعیت تأیید:
              ${
                person.approval_status === 'approved'
                ?
                'تأیید شده'
                :
                'در انتظار'
              }
            </div>

          </div>

        `
      ).join('')
      :
      '<p>حاضری ثبت نشده است.</p>';

    const signaturesHTML =
      signatureItems.length
      ?
      signatureItems.map(
        item => `

          <div class="saved-signature">

            <strong>
              ${escapeHtml(item.person?.full_name || 'نامشخص')}
            </strong>

            ${
              item.imageURL
              ?
              `
                <img
                  src="${item.imageURL}"
                  alt="امضا"
                  crossorigin="anonymous"
                >
              `
              :
              '<p>تصویر امضا در دسترس نیست.</p>'
            }

          </div>

        `
      ).join('')
      :
      '<p>امضایی ثبت نشده است.</p>';

    let actionsBar = '';

    if (meeting.status === 'locked') {

      actionsBar = `

        <div class="detail-actions-bar">

          <span class="locked-stamp">
            🔒 صورتجلسه نهایی و قفل شده
          </span>

          <button
            id="downloadPdfBtn"
            class="pdf-btn"
            type="button"
          >
            دانلود PDF نهایی
          </button>

          <div class="final-lock-note">
            تاریخ قفل:
            ${formatDateTime(meeting.locked_at)}
          </div>

        </div>

      `;

    } else {

      actionsBar = `

        <div class="detail-actions-bar">

          <button
            id="lockMeetingBtn"
            class="lock-btn"
            type="button"
            ${allSigned ? '' : 'disabled'}
          >
            🔒 قفل نهایی صورتجلسه
          </button>

          <div class="final-lock-note">
            ${
              allSigned
              ?
              'همه حاضرین امضا کرده‌اند. پس از قفل، اطلاعات این صورتجلسه دیگر قابل تغییر نیست.'
              :
              `برای قفل نهایی باید امضای همه حاضرین ثبت شده باشد. (${approvedSignatureCount} از ${participants.length})`
            }
          </div>

        </div>

      `;

    }

    detailContent.innerHTML = `

      ${actionsBar}

      <section class="detail-section">

        <h3>اطلاعات جلسه</h3>

        <div class="detail-info-grid">

          <div class="detail-info">
            <strong>شماره صورتجلسه</strong>
            <div>${escapeHtml(meeting.meeting_number || '-')}</div>
          </div>

          <div class="detail-info">
            <strong>وضعیت</strong>
            <div>${statusInfo.label}</div>
          </div>

          <div class="detail-info">
            <strong>تاریخ</strong>
            <div>${formatDate(meeting.meeting_date)}</div>
          </div>

          <div class="detail-info">
            <strong>ساعت</strong>
            <div>${meeting.meeting_time ? meeting.meeting_time.slice(0,5) : '-'}</div>
          </div>

          <div class="detail-info">
            <strong>محل جلسه</strong>
            <div>${escapeHtml(meeting.location || '-')}</div>
          </div>

          <div class="detail-info">
            <strong>امضاها</strong>
            <div>${approvedSignatureCount} از ${participants.length}</div>
          </div>

        </div>

      </section>

      <section class="detail-section">
        <h3>شرح جلسه</h3>
        <div class="detail-row">
          ${escapeHtml(meeting.description || 'شرحی ثبت نشده است.')}
        </div>
      </section>

      <section class="detail-section">
        <h3>حاضرین</h3>
        <div class="detail-list">
          ${participantsHTML}
        </div>
      </section>

      <section class="detail-section">
        <h3>مصوبات و تعهدات</h3>
        <div class="detail-list">
          ${actionsHTML}
        </div>
      </section>

      <section class="detail-section">
        <h3>امضاها</h3>
        <div class="detail-signatures">
          ${signaturesHTML}
        </div>
      </section>

    `;

    const lockMeetingBtn =
      document.getElementById('lockMeetingBtn');

    if (lockMeetingBtn) {
      lockMeetingBtn.addEventListener(
        'click',
        () => lockMeeting(meeting.id)
      );
    }

    const downloadPdfBtn =
      document.getElementById('downloadPdfBtn');

    if (downloadPdfBtn) {
      downloadPdfBtn.addEventListener(
        'click',
        () => downloadMeetingPdf({
          meeting,
          participants,
          actions,
          signatureItems,
          participantMap
        })
      );
    }

  }
  catch (error) {

    console.error(error);

    detailContent.innerHTML =
      'خطا در دریافت اطلاعات: '
      +
      (error.message || 'خطای نامشخص');

  }

}


async function lockMeeting(meetingId) {

  const confirmed = window.confirm(
    'آیا از قفل نهایی این صورتجلسه مطمئن هستید؟\n\nپس از قفل شدن، اطلاعات جلسه، حاضرین، تعهدات و امضاها دیگر قابل تغییر نیستند.'
  );

  if (!confirmed) return;

  try {

    const [
      participantsResult,
      signaturesResult,
      sessionResult
    ] = await Promise.all([

      supabaseClient
        .from('meeting_participants')
        .select('id')
        .eq('meeting_id', meetingId),

      supabaseClient
        .from('meeting_signatures')
        .select('id,approved')
        .eq('meeting_id', meetingId)
        .eq('approved', true),

      supabaseClient.auth.getSession()

    ]);

    if (participantsResult.error) throw participantsResult.error;
    if (signaturesResult.error) throw signaturesResult.error;

    const participantsCount =
      (participantsResult.data || []).length;

    const signaturesCount =
      (signaturesResult.data || []).length;

    if (
      participantsCount === 0
      ||
      signaturesCount < participantsCount
    ) {
      throw new Error(
        'برای قفل نهایی، امضای همه حاضرین باید ثبت شده باشد.'
      );
    }

    const userId =
      sessionResult.data?.session?.user?.id
      ||
      null;

    const lockedAt =
      new Date().toISOString();

    const { error } =
      await supabaseClient
        .from('meetings')
        .update({
          status: 'locked',
          locked_at: lockedAt,
          locked_by: userId
        })
        .eq('id', meetingId)
        .neq('status', 'locked');

    if (error) throw error;

    await supabaseClient
      .from('audit_logs')
      .insert({
        meeting_id: meetingId,
        action: 'meeting_locked',
        metadata: {
          locked_at: lockedAt,
          locked_by: userId
        }
      });

    await loadArchive();
    await openMeetingDetail(meetingId);

  }
  catch (error) {

    console.error(error);
    alert(
      'قفل صورتجلسه انجام نشد: '
      +
      (error.message || 'خطای نامشخص')
    );

  }

}


async function downloadMeetingPdf({
  meeting,
  participants,
  actions,
  signatureItems,
  participantMap
}) {

  if (meeting.status !== 'locked') {
    alert('PDF نهایی فقط برای صورتجلسه قفل‌شده قابل دریافت است.');
    return;
  }

  if (typeof html2pdf === 'undefined') {
    alert('کتابخانه ساخت PDF بارگذاری نشده است. صفحه را یک بار Refresh کنید.');
    return;
  }

  const wrapper =
    document.createElement('div');

  wrapper.setAttribute('dir', 'rtl');

  wrapper.style.cssText = `
    width: 760px;
    padding: 34px;
    background: #ffffff;
    color: #111827;
    font-family: Tahoma, Arial, sans-serif;
    line-height: 1.9;
    direction: rtl;
  `;

  const participantRows =
    participants.map(
      person => `
        <tr>
          <td>${escapeHtml(person.full_name)}</td>
          <td>${escapeHtml(person.position || '-')}</td>
          <td>${escapeHtml(person.email || person.phone || '-')}</td>
          <td>${person.approval_status === 'approved' ? 'تأیید شده' : 'در انتظار'}</td>
        </tr>
      `
    ).join('');

  const actionRows =
    actions.length
    ?
    actions.map(
      action => {
        const owner = participantMap[action.owner_participant_id];
        return `
          <tr>
            <td>${escapeHtml(action.title)}</td>
            <td>${escapeHtml(owner?.full_name || 'تعیین نشده')}</td>
            <td>${formatDate(action.due_date)}</td>
            <td>${getActionStatusInfo(action).label}</td>
          </tr>
        `;
      }
    ).join('')
    :
    '<tr><td colspan="4">تعهدی ثبت نشده است.</td></tr>';

  const signatureBlocks =
    signatureItems.length
    ?
    signatureItems.map(
      item => `
        <div style="width:47%;border:1px solid #e5e7eb;border-radius:10px;padding:12px;page-break-inside:avoid;">
          <strong>${escapeHtml(item.person?.full_name || 'نامشخص')}</strong>
          ${
            item.imageURL
            ?
            `<img crossorigin="anonymous" src="${item.imageURL}" style="display:block;width:100%;height:110px;object-fit:contain;margin-top:10px;background:#fff;">`
            :
            '<div style="margin-top:12px;color:#6b7280;">تصویر امضا در دسترس نیست.</div>'
          }
        </div>
      `
    ).join('')
    :
    '<p>امضایی ثبت نشده است.</p>';

  wrapper.innerHTML = `

    <div style="border-bottom:2px solid #111827;padding-bottom:16px;margin-bottom:22px;">
      <h1 style="margin:0 0 8px;font-size:24px;">صورتجلسه نهایی</h1>
      <div style="color:#4b5563;">این نسخه نهایی و قفل‌شده است.</div>
    </div>

    <table style="width:100%;border-collapse:collapse;margin-bottom:22px;">
      <tr>
        <td style="padding:8px;border:1px solid #e5e7eb;"><strong>شماره:</strong> ${escapeHtml(meeting.meeting_number || '-')}</td>
        <td style="padding:8px;border:1px solid #e5e7eb;"><strong>تاریخ:</strong> ${formatDate(meeting.meeting_date)}</td>
      </tr>
      <tr>
        <td style="padding:8px;border:1px solid #e5e7eb;"><strong>ساعت:</strong> ${meeting.meeting_time ? meeting.meeting_time.slice(0,5) : '-'}</td>
        <td style="padding:8px;border:1px solid #e5e7eb;"><strong>محل:</strong> ${escapeHtml(meeting.location || '-')}</td>
      </tr>
    </table>

    <h2 style="font-size:18px;margin:0 0 8px;">موضوع جلسه</h2>
    <div style="padding:12px;background:#f9fafb;border-radius:8px;margin-bottom:18px;">
      ${escapeHtml(meeting.title)}
    </div>

    <h2 style="font-size:18px;margin:0 0 8px;">شرح جلسه</h2>
    <div style="padding:12px;background:#f9fafb;border-radius:8px;margin-bottom:22px;white-space:pre-wrap;">
      ${escapeHtml(meeting.description || 'شرحی ثبت نشده است.')}
    </div>

    <h2 style="font-size:18px;margin:0 0 10px;">حاضرین</h2>
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:12px;">
      <thead>
        <tr style="background:#f3f4f6;">
          <th style="padding:8px;border:1px solid #e5e7eb;">نام</th>
          <th style="padding:8px;border:1px solid #e5e7eb;">سمت</th>
          <th style="padding:8px;border:1px solid #e5e7eb;">تماس</th>
          <th style="padding:8px;border:1px solid #e5e7eb;">تأیید</th>
        </tr>
      </thead>
      <tbody>${participantRows}</tbody>
    </table>

    <h2 style="font-size:18px;margin:0 0 10px;">مصوبات و تعهدات</h2>
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:12px;">
      <thead>
        <tr style="background:#f3f4f6;">
          <th style="padding:8px;border:1px solid #e5e7eb;">تعهد</th>
          <th style="padding:8px;border:1px solid #e5e7eb;">مسئول</th>
          <th style="padding:8px;border:1px solid #e5e7eb;">مهلت</th>
          <th style="padding:8px;border:1px solid #e5e7eb;">وضعیت</th>
        </tr>
      </thead>
      <tbody>${actionRows}</tbody>
    </table>

    <h2 style="font-size:18px;margin:0 0 10px;">امضاها</h2>
    <div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:24px;">
      ${signatureBlocks}
    </div>

    <div style="margin-top:28px;padding-top:14px;border-top:1px solid #d1d5db;font-size:11px;color:#4b5563;">
      وضعیت: نهایی و قفل‌شده<br>
      تاریخ قفل: ${formatDateTime(meeting.locked_at)}
    </div>

  `;

  // IMPORTANT: html2canvas may generate a blank page when the source
  // element is placed far outside the viewport (for example left:-10000px).
  // Keep the PDF source inside the document layout, but behind the app.
  wrapper.style.position = 'absolute';
  wrapper.style.left = '0';
  wrapper.style.top = '0';
  wrapper.style.zIndex = '-9999';
  wrapper.style.pointerEvents = 'none';

  document.body.appendChild(wrapper);

  try {

    const images =
      Array.from(wrapper.querySelectorAll('img'));

    await Promise.all(
      images.map(
        image => new Promise(
          resolve => {
            if (image.complete) {
              resolve();
              return;
            }
            image.onload = resolve;
            image.onerror = resolve;
          }
        )
      )
    );

    const safeNumber =
      String(
        meeting.meeting_number
        ||
        meeting.title
        ||
        'meeting'
      )
      .replace(/[\\/:*?"<>|]+/g, '-')
      .replace(/\s+/g, '-')
      .slice(0, 80);

    await html2pdf()
      .set({
        margin: 8,
        filename: `meeting-${safeNumber}.pdf`,
        image: {
          type: 'jpeg',
          quality: 0.98
        },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          scrollX: 0,
          scrollY: 0,
          windowWidth: 900
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait'
        },
        pagebreak: {
          mode: ['css', 'legacy']
        }
      })
      .from(wrapper)
      .save();

  }
  finally {

    wrapper.remove();

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



function formatDateTime(value) {

  if (!value) return '-';

  try {

    return new Intl.DateTimeFormat(
      'fa-IR',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    ).format(new Date(value));

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


tasksTabBtn.addEventListener(
  'click',
  openTasksTab
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


taskSearchInput.addEventListener(
  'input',
  renderTasksDashboard
);


taskStatusFilter.addEventListener(
  'change',
  renderTasksDashboard
);


refreshTasksBtn.addEventListener(
  'click',
  loadTasksDashboard
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
