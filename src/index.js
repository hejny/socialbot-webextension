// This script scrapes contacts from Slack workspace directory and download it as VCF
//
// You need to inject jQuery into the page for exaple by jQuerify.
// https://chrome.google.com/webstore/detail/jquerify/gbmifchmngifmadobkcpijhhldeeelkc

const CONTACTS_LIMIT = 10000;

function forRandomTime() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, Math.random() * 20);
    });
}

class SlackContactsScraper {
    async scrape() {
        let contacts = '';
        this._contactsNames = [];

        this.workspaceName = $(`.p-classic_nav__team_header__team__name`).text();

        await this._back();
        await this._scrollTop();
        for (let i = 0; i < CONTACTS_LIMIT; i++) {
            const contactName = await this._getNextContactName();
            if (!contactName) break;
            console.log(`Scraping "${contactName}".`);
            contacts += '\n' + (await this._scrapeContactFromName(contactName));
            contacts = contacts.trim();
            this._contactsNames.push(contactName);
        }
        await this._back();
        return contacts;
    }

    _getLastContactName() {
        if (this._contactsNames.length) {
            return this._contactsNames[this._contactsNames.length - 1];
        } else {
            return null;
        }
    }

    async _getNextContactName(scrolls = 0) {
        let nextContactName = null;
        const contactNames = this._scrapeContactNames();
        if (this._getLastContactName()) {
            const i = contactNames.lastIndexOf(this._getLastContactName());
            nextContactName = contactNames[i + 1];
        } else {
            nextContactName = contactNames[0];
        }
        if (nextContactName) {
            return nextContactName;
        }

        if (scrolls > 5) return null;
        await this._scroll();
        return this._getNextContactName(scrolls + 1);
    }

    _scrapeContactNames() {
        return Array.from($('.p-member_directory__member_row')).map((contactElement) =>
            $(contactElement)
                .find(`.c-member_name`)
                .text(),
        );
    }

    async _scrollTop() {
        $('.p-member_directory__member_row')[0].parentElement.parentElement.parentElement.parentElement.scrollTop = 0;
        await forRandomTime();
    }

    async _back() {
        $(`.p-global_nav__flex_btn--back`).click();
        await forRandomTime();
    }

    async _scroll(attempts = 0) {
        try {
            $('.p-member_directory__member_row')[0].parentElement.parentElement.parentElement.parentElement.scrollTop +=
                Math.random() * 100;
        } catch (error) {
            if (attempts > 5) {
                throw error;
            }
            await forRandomTime();
            this._scroll(attempts + 1);
        }
        await forRandomTime();
    }

    async _scrapeContactFromName(name) {
        $(`*:contains('${name}')`).click();
        await forRandomTime();

        const FN = $(`.p-member_profile_name__title`).text();
        const ROLE = $(`.p-member_profile_name__subtitle`).text();
        const TEL = $(`.p-member_profile_field__label:contains('Phone number')`)
            .next()
            .text();
        const EMAIL = $(`.p-member_profile_field__label:contains('Email address')`)
            .next()
            .text();

        const contact = `
BEGIN:VCARD
VERSION:3.0
FN:${FN}
TEL;TYPE=CELL:${TEL}
NOTE:Imported from ${this.workspaceName} Slack.
EMAIL:${EMAIL}
ROLE:${ROLE}
END:VCARD
        `.trim();

        await this._back();

        return contact;
    }
}

function downloadVcard(filename, contacts) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/vcard;charset=utf-8,' + encodeURIComponent(contacts));
    element.setAttribute('download', filename + '.vcf');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element);
}

window.downloadContacts = (async () => {
    const slackContactsScraper = new SlackContactsScraper();
    const contacts = await slackContactsScraper.scrape();

    downloadVcard(slackContactsScraper.workspaceName, contacts);
})();

$(() => {
    $('body').appendChild(`
    <button id="download-contacts" onclick="window.downloadContacts();">Download contacts</button>
    `);
});

// Scrolling detection: $('*').on( 'scroll' ,(event)=>console.log(event.target))
// TODO: URL: in VCARD
/**/
