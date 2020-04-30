// This script scrapes contacts from Slack workspace directory and download it as VCF
//
// You need to inject jQuery into the page for exaple by jQuerify.
// https://chrome.google.com/webstore/detail/jquerify/gbmifchmngifmadobkcpijhhldeeelkc

const CONTACTS_LIMIT = 10000;

function forRandomTime(random=20,fixed=1) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, Math.random() * length+fixed);
    });
}

class SlackContactsScraper {
    async scrape() {
        let contacts = '';
        this._contactsNames = [];

        this.workspaceName = $(`.p-ia__sidebar_header__team_name_text`).text();

        //await this._back();
        //await this._scrollTop();
        for (let i = 0; i < CONTACTS_LIMIT; i++) {
            const contactName = await this._getNextContactName();
            if (!contactName) break;
            console.log(`Scraping "${contactName}".`);
            contacts += '\n' + (await this._scrapeContactFromName(contactName));
            contacts = contacts.trim();
            this._contactsNames.push(contactName);

        }
        //await this._back();
        return contacts;
    }

    async _nextPage(){
        console.log(`Listing next page.`);
        $(`button[data-qa="browse_page_paginator_forward_btn"]`).click();
        await forRandomTime(20,2000);
    }

    _getLastContactName() {
        if (this._contactsNames.length) {
            return this._contactsNames[this._contactsNames.length - 1];
        } else {
            return null;
        }
    }

    async _getNextContactName(tryNextPage = true) {
        let nextContactName = null;
        const contactNames = this._scrapeNewContactNames();
        if (this._getLastContactName()) {
            const i = contactNames.lastIndexOf(this._getLastContactName());
            nextContactName = contactNames[i + 1];
        } else {
            nextContactName = contactNames[0];
        }
        if (nextContactName) {
            return nextContactName;
        }


        if(tryNextPage){
            await this._nextPage()
            return await this._getNextContactName(false);
        }


        console.log('contactNames',contactNames);
        console.log('this._getLastContactName()',this._getLastContactName());
        console.log('nextContactName',nextContactName);

        //if (scrolls > 5) return null;
        //await this._scroll();
        //return this._getNextContactName(scrolls + 1);

        return null;
    }

    /*
    _contactsNamesTmpSet = new Set();
    _scrapeContactNames() {
        for( const contactName of this._scrapeNewContactNames()){



            if(!this._contactsNamesTmpSet.has(contactName)){
                this._contactsNamesTmpSet.add(contactName);
            }
        }
        return Array.from(this._contactsNames);
    }*/
    _scrapeNewContactNames() {
        return Array.from($('.p-browse_page_member')).map((contactElement) =>
            $(contactElement)
                .find(`.p-browse_page_member_card_entity__name_text`)
                .text(),
        );
    }

    /*
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
    */

    async _scrapeContactFromName(name) {
        $(`.p-browse_page_member_card_entity .p-browse_page_member_card_entity__name_text span:contains('${name}')`).css('border','1px solid red').click();
        await forRandomTime(20,100);

        const TITLE = $(`.p-member_profile_name__title`).text();
        const DISPLAY_NAME = $(`.p-member_profile_field__label:contains('Display name')`)
        .next()
        .text();
        let FN = DISPLAY_NAME||TITLE;
        let error = '';

        if(FN!==name){
            console.warn(`Want to scrape "${name}" but scraped "${FN}".`);
            error=`Probbaply not scraped correctly from "${window.location}". Want to scrape "${name}" but scraped "${FN}".`
            FN=name;
        }

        const ROLE = $(`.p-member_profile_name__subtitle`).text();
        const STATUS = $(`.p-member_profile_field__label:contains('Status')`)
            .next()
            .text();
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
NOTE:${STATUS?STATUS+'\\n':''}${error?error+'\\n':''}Imported from ${this.workspaceName} Slack.
EMAIL:${EMAIL}
ROLE:${ROLE}
END:VCARD
        `.trim();

        //await this._back();

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

$(() => {
    $('body').append(`
    <button id="download-contacts">Download contacts</button>
    `);

    $('#download-contacts').click(async () => {
        if (!window.location.toString().match(/\/browse-people/)) {
            /*if (confirm(`You need to be at .../browse-people path with directory opened. Do you want to go there now?`)) {
                window.location = window.location + '/browse-people';
            }*/

            alert(`Please go to /browse-people and check "Show deactivated accounts" in filter.`)
            return;
        }

        const slackContactsScraper = new SlackContactsScraper();
        const contacts = await slackContactsScraper.scrape();

        downloadVcard(slackContactsScraper.workspaceName, contacts);
    });
});

// Scrolling detection: $('*').on( 'scroll' ,(event)=>console.log(event.target))
// TODO: URL: in VCARD
/**/
