const d="4b370dcc-6fd1-4c70-ad6c-98ba1e9a9835";async function b(n){const{clientName:o,clientEmail:a,clientPhone:s,notes:t,serviceName:r,braiderName:c,dateTimeDisplay:m}=n,l={access_key:d,subject:"New Touba Hair Booking",from_name:"Touba Hair Website",name:o||"Touba Hair Client",email:a||"no-email-provided@example.com",message:`
New booking from your website:

Client: ${o||"N/A"}
Phone: ${s||"N/A"}
Email: ${a||"N/A"}

Service: ${r||"N/A"}
Braider: ${c||"N/A"}
Date & Time: ${m||"N/A"}

Notes:
${t||"(none)"}
    `},i=await fetch("https://api.web3forms.com/submit",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(l)}),e=await i.json();if(!i.ok||!e.success)throw console.error("Web3Forms error:",e),new Error(e.message||"Failed to send booking email");return e}export{b as s};
