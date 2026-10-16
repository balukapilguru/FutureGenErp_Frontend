const termsSections = [
  {
    title: "Admission",
    items: [
      "Students must provide all required documents and information during the admission process.",
      "Admission will be confirmed only after payment of the booking amount, as decided by the management from time to time.",
    ],
  },
  {
    title: "Fees",
    items: [
      "Students shall pay the course fees as per the due dates/terms mentioned overleaf. Fees are non-refundable, non-transferable and non-adjustable under any circumstances.",
      "Refunds will not be initiated in any case. If a refund is processed at the sole discretion of the Academy, the following will be deducted from the fee paid: (a) applicable taxes; (b) service charges, if any services were opted; and (c) any applicable third-party charges.",
      "If the student opted for a loan during enrollment, then on cancellation of enrollment the loan partner's charges will also apply, in addition to the charges mentioned in above point.",
      "Late payment of fees shall attract penal interest @1.5% per month.",
      "Future Gen Technologies reserves its right to cancel the admission in case of non-payment of fees as per the agreed due dates.",
      'Course fees may vary from student to student, based on their merit and other relevant factors as determined by Future Gen Technologies ("Academy") administration, at its sole discretion.',
    ],
  },
  {
    title: "Course Material",
    items: [
      "The course material (Soft Copy or Hard Copy) provided by the Academy is the intellectual property of Future Gen Technologies and cannot be reproduced or used for commercial purposes without written permission of the Academy.",
      "Any damage or loss of course material will be the responsibility of the student and shall attract additional charges for an extra copy of the course material, as decided by the administration from time to time.",
    ],
  },
  {
    title: "Attendance",
    items: [
      "Regular attendance is essential for successfully completing the course and obtaining a certificate.",
      "In case of continuous absence from 3 classes without intimation, the Academy reserves its right to terminate the admission.",
      "In case of absence, make-up/extra classes may be arranged at the discretion of the Academy and subject to availability of resources. For clarity, the Academy is not obliged to provide make-up/extra classes.",
    ],
  },
  {
    title: "Conduct",
    items: [
      "Students must conduct themselves respectfully towards the Academy staff and fellow students, and must not damage the Academy's property.",
      "Any form of harassment, discrimination, or bullying will not be tolerated and may lead to immediate expulsion of the student from the Academy.",
      "Use of drugs or alcohol within the Academy's premises is strictly prohibited and shall lead to immediate expulsion from the Academy.",
    ],
  },
  {
    title: "Certification",
    items: [
      "Certificates will be awarded to students who successfully complete the course as per the Academy's criteria, as decided by the management from time to time.",
      "The certificate does not guarantee employment or acceptance/admission into any institution.",
    ],
  },
  {
    title: "Liability",
    items: [
      "The Academy is not responsible for any injury, loss, or damage to the students or their belongings within the Academy's premises or during any offsite activity.",
      "Students must take responsibility for their personal safety and belongings while attending classes at the Academy or any other location.",
    ],
  },
  {
    title: "Change in Policies",
    items: [
      "The Academy may revise its policies, rules and regulations, course structure, fees, timings, or any other aspect of the Academy at its sole discretion from time to time, without prior notice to the students.",
      "Such revised policies will be applicable to all existing and new students.",
    ],
  },
  {
    title: "Dispute Resolution",
    items: [
      "Any dispute arising out of or related to these terms and conditions shall be resolved amicably through mutual discussion and agreement between the Academy and the student. Any unresolved dispute shall be subject to the jurisdiction of the courts of Hyderabad, Telangana, India.",
    ],
  },
  {
    title: "Termination of Admission",
    items: [
      "The Academy reserves the right to terminate the admission of any student at any time, without assigning any reason.",
      "In such cases, the Academy may, at its sole discretion, refund a portion of the fees, which completely depends on the Academy's decision and on the duration of the course completed by the student.",
    ],
  },
  {
    title: "No Placement Guarantee",
    items: [
      "The Academy does not provide any placement guarantee to the students but may assist them in finding suitable job opportunities through guidance and counselling.",
      "Every eligible student will be given the opportunity to attend interviews based on their job status as determined by Future Gen Technologies.",
      "If a student misses two consecutive interviews, the student will automatically be disqualified from further interviews.",
    ],
  },
  {
    title: "Use of ID Card",
    items: [
      "Each student will be issued an identification card (ID card) by the Academy, and it must be carried by the student at all times while attending classes or any other activities conducted by the Academy.",
    ],
  },
  {
    title: "Copying Institute Content",
    items: [
      "Distributing brochures or course material of any other academy or coaching centre, including lectures, notes, presentations, or any other content, or promoting any other coaching institute, is strictly prohibited. Any violation of this rule may lead to immediate expulsion from the Academy, and legal action may be taken against the student.",
    ],
  },
  {
    title: "Teaching Staff",
    items: [
      "While the Academy will endeavour to provide training with a specific teaching staff member, there is no commitment to do so.",
      "The Academy reserves the right to assign trainers based on availability, and students cannot demand a specific trainer.",
    ],
  },
  {
    title: "Course Curriculum",
    items: [
      "The Academy reserves the right to update the course curriculum at its discretion, without any prior notice to the students.",
      "Students are expected to keep themselves updated with any changes in the course curriculum.",
    ],
  },
  {
    title: "Course Duration",
    items: [
      "The course duration may vary from batch to batch, depending on factors such as students' attendance, training methodology, and other relevant factors as determined by the Academy.",
      "The Academy reserves the right to change the course duration at any time without prior notice.",
    ],
  },
  {
    title: "Paid Internship Support",
    items: [
      "If a paid internship is included in the student's course package, the student will be given the chance to opt for it only once. A student who does not opt for it will be excluded from the paid internship.",
      "The paid internship may be at any company, location, or position. The student must clear all requirements of the company, including an interview if the company insists.",
      "The Academy does not guarantee any specific internship or job placement.",
      "The Academy will not be liable for any issues or disputes that arise between the student and the internship provider.",
      "The Academy may assist students in finding suitable paid internships based on their skills and interests.",
      "The Academy may charge a separate fee for providing internship support services.",
    ],
  },
  {
    title: "Project Assignment",
    items: [
      "The Academy may provide practice projects to the students for upgrading their learning and skill development.",
      "The projects assigned may be capstone, live, or previously completed projects, depending on availability and suitability.",
      "Students must complete the project within the given time frame and submit it to the Academy for evaluation.",
      "Submission of projects are mandatory for placement support.",
    ],
  },
  {
    title: "Intellectual Property",
    items: [
      "All intellectual property created by students during the live project or internship belongs to the Academy.",
      "The Academy may use such intellectual property for promotional or educational purposes, at its sole discretion.",
      "The Academy will not claim any ownership rights over the student's intellectual property.",
    ],
  },
  {
    title: "Master Access Card (If applicable)",
    items: [
      "The Master Access Card is a special learning benefit provided by Future Gen Technologies to eligible students.",
      "The Master Access Card enables students to access and learn unlimited eligible courses offered by Future Gen Technologies through the online mode during the validity period of the card.",
      "The Master Access Card benefit can be availed only after the student has paid the entire course fee of their enrolled course.",
      "Students can access and learn eligible courses one after another and cannot pursue multiple courses simultaneously through the Master Access Card.",
      "The validity period of the Master Access Card shall be determined by the management of Future Gen Technologies.",
      "Future Gen Technologies management reserves the right to modify, extend, reduce, or change the validity period and/or terms of the Master Access Card benefit.",
      "The Master Access Card is an additional benefit provided by Future Gen Technologies and shall not be considered as part of the enrolled course fee or course deliverables.",
      "The Master Access Card benefit is not applicable to, and shall not be considered while processing, any course cancellation, refund, fee adjustment, or refund claim.",
      "The Master Access Card is non-transferable and can be used only by the student to whom it is issued.",
      "Access to courses under the Master Access Card shall be subject to the availability and eligibility of courses designated by Future Gen Technologies under this benefit.",
      "Future Gen Technologies reserves the right to add, modify, replace, or discontinue any course or program available under the Master Access Card without affecting the student's enrolled course.",
      "Any misuse, sharing of login credentials, unauthorized access, or violation of Future Gen Technologies policies may result in suspension or cancellation of the Master Access Card benefit.",
      "The Master Access Card benefit has no cash value, cannot be exchanged for cash, and cannot be transferred to another student.",
      "Availing the Master Access Card benefit does not automatically guarantee certification, placement, internship, or any other benefit unless specifically applicable to the respective course.",
      "By availing the Master Access Card, the student acknowledges and agrees to abide by the above terms and conditions and any additional policies applicable to the Master Access Card.",
    ],
  },
  {
    title: "Class Recordings",
    items: [
      "Class recordings will be made available only through the official Future Gen Technologies Mobile App to eligible enrolled students.",
      "The login credentials provided to an enrolled student are strictly personal and non-transferable and must not be shared with any other person.",
      "Students are strictly prohibited from sharing, distributing, downloading, recording, reproducing, or providing access to class recordings or login credentials to any other individual.",
      "If it comes to the notice of Future Gen Technologies management that a student has shared their login credentials or provided unauthorized access to class recordings, the student's access to the Future Gen Technologies Mobile App and/or class recordings may be immediately barred or suspended.",
      "Future Gen Technologies reserves the right to take appropriate action against any student found misusing, distributing, or providing unauthorized access to class recordings.",
      "Class recordings are provided as a learning support and may be subject to availability, technical limitations, and the applicable recording retention period determined by Future Gen Technologies.",
      "Future Gen Technologies reserves the right to modify, restrict, suspend, or discontinue access to class recordings where required due to operational, technical, academic, or policy-related reasons.",
    ],
  },
];

const privacyPolicy = [
  {
    title: "Information Collection",
    text: "We collect personal information such as name, email address, phone number, and other details from students at the time of enrollment.",
  },
  {
    title: "Use of Information",
    text: "We use the information collected to contact students regarding course updates, provide course materials, and issue certificates of completion.",
  },
  {
    title: "Information Sharing",
    text: "We do not share personal information with any third parties without the student's consent, except as required by law.",
  },
  {
    title: "Security",
    text: "We take reasonable measures to ensure the security of the personal information collected from students.",
  },
  {
    title: "Cookies",
    text: "We use cookies on our website to track user behaviour and improve the user experience. Students can disable cookies in their web browser if they choose to do so.",
  },
  {
    title: "Data Retention",
    text: "We retain personal information for as long as necessary to provide the course and related services, or until the student requests that their information be deleted.",
  },
  {
    title: "Modification",
    text: "We reserve the right to modify this privacy policy at any time without prior notice.",
  },
];

const StudentTermsAndConditions = () => {
  const headingClass = "fs-14 fw-600 black_300";
  const paragraphClass = "black_300 fs-14 ms-3";
  return (
    <>
      {termsSections.map((section, sectionIndex) => (
        <div className="ps-4" key={section.title}>
          <h5 className={headingClass}>
            {sectionIndex + 1}. {section.title}:
          </h5>
          <ul className="black_300 fs-14 ms-3 ps-3">
            {section.items.map((item) => (
              <li key={item} style={{ listStyleType: "disc" }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="ps-4">
        <h5 className={`${headingClass} pb-2`}>Privacy Policy:</h5>
      </div>
      {privacyPolicy.map((item, index) => (
        <div className="ps-4" key={item.title}>
          <h5 className={headingClass}>
            {index + 1}. {item.title}:
          </h5>
          <p className={paragraphClass}>{item.text}</p>
        </div>
      ))}

      <div className="p-4">
        <p className="black_300 fs-14">
          By signing this form, I acknowledge that I have read, understood, and
          agree to abide by the terms and conditions and privacy policy. I
          further understand that these terms and conditions are deemed
          automatically acknowledged and accepted by me upon taking admission.
        </p>
        <p className="black_300 fs-14">
          Further, I hereby give my consent for Future Gen Technologies and its affiliates to send their promotional
          emails/communication to me.
        </p>
      </div>
    </>
  );
};

export default StudentTermsAndConditions;