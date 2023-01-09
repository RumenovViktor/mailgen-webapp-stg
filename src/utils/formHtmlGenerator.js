function createGuid()
{
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

export default function generateHtml(data, baseUrl) {
    let additionalData = ''

    if (data.firstNameIncluded) {
        additionalData += `
        <div>
            <label for="firstName">First Name:</label>
            <input name="firstName" type="text" value="" placeholder="First name..." /></div>`
    }

    if (data.lastNameIncluded) {
        additionalData += `
        <div>
            <label for="lastName">Last Name:</label>
            <input name="lastName" type="text" value="" placeholder="Last name" />
        </div>`
    }

    if (data.phoneNumberIncluded) {
        additionalData += `
            <div>
                <label for="phoneNumber">PhoneNumber:</label>
                <input name="phoneNumber" type="tel" value="" placeholder="Phone Number..." />
            </div>`
    }

    if (data.birthDateIncluded) {
        additionalData += `
            <div>
                <label>Birthday</label>
                <input style="width: 50px" name="dayOfBirth" type="number" value="" placeholder="DD" />
                <span>/</span>
                <input style="width: 50px" name="monthOfBirth" type="number" value="" placeholder="MM" />
            </div>`
    }

    const html = `
        <h1>Subscribe</h1>
        <div>
            <iframe name="hiddenFrame" width="0" height="0" border="0" style="display: none;"></iframe>
        </div>
        <form method="post" target="hiddenFrame" action="${baseUrl}/subscribers/subscribe?u=${data.u}">
            <label for="email">Email:</label>
            <input name="email" type="email" value="" placeholder="Please enter your email here.." />
            ${additionalData}
            <input type="submit" value="Submit" />
            <div style="display: none">
                <input name="tags" type="text" value="${data.tags.join(',')}">
            </div>
            <!-- Do not remove this! The purpose of it is to restrict bots and fake signups.  -->
            <div style="display: none; position: absolute; left: -10000px">
                <input name="honey" type="text" value="${createGuid()}">
            </div>
        </form>`

    return {
        __html: html
    };
}