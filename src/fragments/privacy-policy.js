import React, { Fragment } from 'react';
import { Linking, ScrollView, View } from 'react-native';

import H1 from '../components/h1';
import Hyperlink from '../components/hyperlink';
import Text from '../components/text';

function Paragraph({content, heading, paragraphNumber}) {
  return (
    <View style={{marginVertical: 16}}>
      <Text big blue semiBold>{`${paragraphNumber}    ${heading}`}</Text>
      <Text>{content}</Text>
    </View>
  );
}

export default () => {
  const paragraphs = [
    {
      heading: 'ABOUT IFIS',
      content: `Interswitch Financial Inclusion Services Limited [IFIS] has been positioned to serve as the interconnect point and infrastructure for integrating and delivering electronic payment services to the unbanked, under-banked and banked. We work with financial service providers, merchants, billers, and other organizations that aim to increase their efficiency and outreach through our network of human service interfaces for secure financial transactions nationwide.

This privacy policy will explain how our organization uses the personal data we collect from our customers and related partners when they use our website or subscribe to any of our products and services.`
    },
    {
      heading: 'INTRODUCTION',
      content: `IFIS conducts business in a responsible and sustainable manner and ensures customer information is securely collected, processed and stored based on business requirements. In furtherance to this and compliance with industry regulations, IFIS has provided appropriate documentation, which includes a privacy policy. IFIS therefore provides notice about this policy and applicable procedures. It identifies the purposes for which personal information is collected, used, processed, disclosed, retained and disposed.

Throughout this Privacy Policy, we use the term "personal information or data" to describe information that can be associated with a specific person and can be used to identify that person. We do not consider personal information to include information that has been made anonymous such that it does not identify a specific user.`
    },
    {
      heading: 'SCOPE AND CONSENT',
      content: `As a Customer, you accept this Privacy Policy when you sign up for, access, or use our products, services, content, features, technologies or functions offered on our website and all related sites, applications, and services (collectively referred to as “IFIS Services”). 

This Privacy Policy is intended to govern the use of IFIS Services by users (including, without limitation those who use these IFIS Services in the daily course of their trade, practice or business) unless otherwise agreed through contract. User reserve the right to exercise their data protection right as listed under the Customer Data Protection Rights.`
    },
    {
      heading: 'COLLECTION OF PERSONAL INFORMATION',
      content: `We collect Personally Identifiable Information (PII), otherwise known as Personal Information or Personal Data. They include: Name, email address, phone number, contact address, limited financial information, location data, device data, etc.`
    },
    {
      heading: 'HOW WE COLLECT PERSONAL INFORMATION',
      content: `Customers data is collected electronically when they visit our website and register to use any of our services. This is collected electronically with exchanges between your system (Computer, Server, Mobile Device) or service provider’s system and our system. 

We collect Customers’ data manually when they complete our product and services registration forms in registering to use any of our services. Similar data are also collected when customers or visitors’ visit our physical locations for enquiries or business relationship.

We collect information from or about customers from other sources, such as through your contact with us, including our Customer Support interfaces – email, portal, phone calls, social media and other communication channels; Customer support teams, Customer response to surveys, Training programmes, Corporate Social Responsibility events, Promotional events, and interactions with members of the Interswitch Group or other companies (subject to their privacy policies and applicable law).

We may also obtain information about you from third parties such as credit bureaus and identity verification services.`
    },
    {
      heading: 'HOW WE USE COLLECTED INFORMATION',
      content: `We collect personal information to provide users of our services with a secure, smooth, efficient, and customized experience. Furthermore, the information collected may also be used to: provide IFIS Services and customer support; process transactions and send notices about your transactions; verify your identity, including during account creation and password reset processes; resolve disputes, collect fees, and troubleshoot problems; manage risk, or to detect, prevent, and/or remediate fraud or other potentially prohibited or illegal activities; detect, prevent or remediate violations of policies or applicable user agreements.

We also collect personal information to improve Services by customizing your user experience; measure the performance of the IFIS Services and improve their content and layout; manage and protect our information technology infrastructure; provide targeted marketing and advertising, provide service update notices, and deliver promotional offers based on your communication preferences; contact you at any telephone number, by placing a voice call or through text (SMS) or email messaging; perform creditworthiness and solvency checks, and compare information for accuracy and verify it with third parties.

Additionally, we may contact you via electronic means to notify you regarding your account, to troubleshoot problems with your account, to resolve a dispute, to collect fees or monies owed, to poll your opinions through surveys or questionnaires, or as otherwise necessary to service your account. Furthermore, we may contact you to offer coupons, discounts and promotions, and inform you about IFIS Services or its group services.

Finally, we may contact you as necessary to enforce our policies, applicable law, or any agreement we may have with you. When contacting you via phone, to reach you as efficiently as possible we may use, and you consent to receive, autodialled or pre-recorded calls and text messages. Where applicable and permitted by law, you may decline to receive certain communications.`
    },
    {
      heading: 'PROTECTION AND STORAGE OF PERSONAL INFORMATION',
      content: `We store and process your personal information on our computers in Lagos, Nigeria and anywhere else where our facilities are located. We protect your information using physical, technical, and administrative security measures to reduce the risks of loss, misuse, unauthorized access, disclosure and alteration.

Some of the safeguards we use are firewalls and data encryption, physical access controls to our data centres, and information access authorization controls. We have also taken additional measure by ensuring our system complies with industry information security standards.`
    },
    {
      heading: 'MARKETING',
      content: `We do not sell or rent your personal information to third parties for their marketing purposes without your explicit consent. We may combine customer’s information with information collected from other companies and use it to improve and personalize IFIS Services, content, and advertising. We have also included opportunity for customers that had initially subscribed to receiving notification or information about their activities in relation to the use of IFIS’s service to unsubscribed or request to be removed from applicable databases.`
    },
    {
      heading: 'SHARING PERSONAL INFORMATION WITH OTHER IFIS USERS',
      content: `When transacting with others, we may provide those parties with information to complete the transaction, such as your name, account ID, contact details, shipping and billing address, or other information needed to promote the reliability and security of the transaction. If a transaction is held, fails, or is later invalidated, we may also provide details of the unsuccessful transaction. 

To facilitate dispute resolution, we may provide a buyer with the seller’s address so that goods can be returned to the seller. The receiving party is not allowed to use this information for unrelated purposes, such as to directly market to you, unless you have agreed to it. Contacting users with unwanted or threatening messages is not authorised by IFI

We may provide or display customer information to a third-party while consummating transactions to validate that transactions are being exchanged with valid receiver

We work with third parties, including merchants, to enable them to accept or send payments from or to Customers using IFIS Services. In doing so, a third party may share information about customers with us, such as email address or mobile phone number, to inform such customer that a payment has been sent. We use this information to confirm that users are IFIS customers and that IFIS as a form of payment can be enabled, or to send customer notification of payment status. Also, we may oblige request to validate that a customer transacts business with IFI

Customer’s card information may be available for their subsequent reuse if they chose for it to be remembered at previous attempts. Do note that merchants, sellers, and users involved in transactions may have their own privacy policies, and IFIS does not allow the other transacting party to use this information for anything other than providing IFIS Services, IFIS is not responsible for their actions, including their information protection practices.
      
IFIS will not disclose your credit/debit card number or bank account number to anyone or with the third parties that offer or use IFIS Services, except with customers’ express permission or if we are required to do so to comply with credit/debit card rules, a subpoena, law enforcement or other legal processes.`
    },
    {
      heading: 'SHARING PERSONAL INFORMATION WITH THIRD PARTIES',
      content: `We may share customers’ personal information with:
      
Members of the Interswitch group to provide joint content, products, and services (such as registration, transactions and customer support), to help detect and prevent potentially illegal acts and violations of our policies, and to guide decisions about their products, services, and communications. This information will only be used for marketing communications only, if customers have requested for the services.

Financial institutions that we partner with to jointly create and offer a product may only use this information to market IFIS related products, unless customer has given consent for other uses.

Credit bureaus and collection agencies to report account information, as permitted by law.

Banking partners as required by credit/debit card association rules for inclusion on their list of terminated merchants.

Companies that we plan to merge with or are acquired by. (Should such a combination occur, we will require that the new combined entity follow this Privacy Policy with respect to customer personal information. Customer will receive prior notice if personal information would be used contrary to this policy).

Law enforcement, government officials, or other third parties pursuant to a subpoena, court order, or other legal process or requirement applicable to IFIS or one of its affiliates; when we need to do so to comply with law or credit/debit card rules; or when we believe, in our sole discretion, that the disclosure of personal information is necessary to prevent physical harm or financial loss, to report suspected illegal activity or to investigate violations of our User Agreement.

Other unaffiliated third parties, for the following purposes:
  ·	Fraud Prevention and Risk Management: to help prevent fraud or assess and manage risk.
  ·	Customer Service: for customer service purposes, including to help service your accounts or resolve disputes.
  ·	Shipping: in connection with shipping and related services for purchases made using IFIS Services.
  ·	Legal Compliance: to help them comply with anti-money laundering and counter-terrorist financing verification requirements.
  ·	Service Providers: to enable service providers under contract with us to support our business operations, such as fraud prevention, bill collection, marketing, customer service and technology services. Our contracts dictate that these service providers only use customer information in connection with the services they perform for us and not for their own benefit.

Other third parties with your consent or direction to do so.
  ·	Please note that these third parties may be in other countries where the laws on processing personal information may be less stringent than in our country of primary jurisprudence.
  ·	If customers open any of our products and services or related wallet account directly on a third-party website or via a third-party application, any information that are entered on such systems (and not directly on an IFIS website) will be shared with the owner of the third-party website or application. These sites are governed by their own privacy policies and customers are encouraged to review their privacy policies before providing them with personal information. IFIS is not responsible for the content or information practices of such third parties.`
    },
    {
      heading: 'CROSS-BORDER TRANSFER OF PERSONAL INFORMATION',
      content: `IFIS is committed to protecting customers’ personal information regardless of where the data resides and to providing appropriate protection for where such data is transferred across borders, including outside of Nigeria. We have further taken measure to ensure our relationships are with countries that are governed by similar data protection regulation. IFIS conducts assessment of other entities to provide a reasonable assurance of the safety of customer’s information.`
    },
    {
      heading: 'CUSTOMER DATA PROTECTION RIGHTS',
      content: `Our customers have data protection rights and are entitled to the following:
The right to access – Customer have the right to request for copies of their personal data. IFIS may charge a fee for this service if it will require a substantial amount of resources to accomplish.

The right to rectification – Customers have the right to request that IFIS corrects any information they believe and have proven have been captured inaccurately. Customers also have the right to request IFIS to complete the information they believe is incomplete.

The right to erasure – Customers have the right to request that IFIS erases their personal data, under certain conditions. These conditions are not limited to regulatory requirements, law enforcement agencies, or where such action may cause disruption to our system.

The right to restrict processing – Customers have the right to request that IFIS restricts the processing of their personal data, under certain conditions. (as above)

The right to object to processing – Customers have the right to object to Our Company’s processing of your personal data, under certain conditions. (as above)

The right to data portability – Customers have the right to request that IFIS transfer the data that we have collected to another organization, or directly to them, under certain conditions. (as above)

Customer request based on any of the rights above shall be handled between 2 to 4 working weeks. Customer may contact us by email or writing.`
    },
    {
      heading: 'THE USE OF COOKIES AND SIMILAR TECHNOLOGIES',
      content: `When Customers access our websites or use IFIS Services, we may place small data files on your computer or other devices. These data files may be cookies, pixel tags, "Flash cookies," or other local storage provided by your browser or associated applications (collectively referred to as "Cookies"). These technologies are used to recognize users as customers; customize IFIS Services, content, and advertising; measure promotional effectiveness; help ensure that account security is not compromised; mitigate risk and prevent fraud; and to promote trust and safety across IFIS Services and related sites. 

Users can freely decline our Cookies if the web browser or browser add-on permits, unless our Cookies are required to prevent fraud or ensure the security of websites we control. However, declining our Cookies may interfere with users’ use of our websites and IFIS Services.`
    },
    {
      heading: 'PRIVACY POLICIES OF OTHER WEBSITES',
      content: `This privacy policy applies to only Interswitch Group and not any other brands, though mentioned on our Websites. Neither does it apply to our Merchants, Vendors, or other related partners.`
    },
    {
      heading: 'CUSTOMER CONSENT',
      content: `Please refer to end of this notice for providing your consent.  Your consent to personal data collection and processing may be revoked by notifying us via our contact page. For users below the age of 18, the consent should be provided by the holder of parental responsibility of the child.

Please note, in case you choose to not provide us with the consent or withdraw the consent at any given point of time, we shall not be able to provision the services as detailed in section 2.2 of this notice.`
    },
    {
      heading: 'AVAILABLE REMEDIES',
      content: `In the event of a violation of this Policy by the Company, we shall immediately upon becoming aware of such violation, assess the extent of the violation and take specific actions such as correction, modification, or transfer of the data, subject to the lawful demands of the data subject.  The specific actions of correction, modification and transfer shall be effected within 30days, subject to external factors not within the reasonable control of the Company.`
    },
    {
      heading: 'CHANGES TO OUR PRIVACY POLICY',
      content: `We review our privacy policy periodically and when there is any substantial change to business or regulatory requirement. At the minimum, we shall review this annually and communicate via our communication channels such as Newsletter, on Website, Social Media Accounts.`
    },
    {
      heading: 'HOW TO CONTACT US',
      content: `Customers who have concerns, questions about privacy policy or would like to exercise their protection rights can contact us through the following channels:
      
Email us at: dpo@interswitchgroup.com
Call us: 016283888
Customer Contact Centre 0700-9065000
Or write to us at: IFIS Limited, 1648C Oko-Awo Street, Victoria Island Lagos.`
    }
  ];

  return <Fragment>
    <ScrollView 
      contentContainerStyle={{
        padding: 20
      }}
    >
      <H1>Privacy Policy</H1>

      {paragraphs.map(({content, heading}, index) => <Paragraph 
        content={content}
        heading={heading}
        paragraphNumber={index + 1}
      />)}

      {/* <Text blue bold uppercase>
        ABOUT IFIS
      </Text> */}
      {/* <Text>
        Interswitch Financial Inclusion Services Limited {`[IFIS]`} has been positioned to serve as the interconnect point and infrastructure for integrating and delivering electronic payment services to the unbanked, under-banked and banked. We work with financial service providers, merchants, billers, and other organizations that aim to increase their efficiency and outreach through our network of human service interfaces for secure financial transactions nationwide.{`\n\n`}
        This privacy policy will explain how our organization uses the personal data we collect from our customers and related partners when they use our website or subscribe to any of our products and services.
      </Text> */}
      {/* <Text 
        style={{
          marginTop: 5
        }}
      >
        We electronically and manually collect Personal Data and Personal Identifiable Information, PII, of customers which includes name, email address, phone number, contact address, limited financial information, location data, device data etc.{`\n\n`}
        We use the collected personal information to provide secure & customised user experience, advertising, marketing and other purposes.{`\n\n`}
        We store and process your personal information on our computers in Lagos, Nigeria and other locations where our facilities are located. The information is protected using physical, technical, electronic and administrative security safeguards like firewalls, data encryption, physical access controls to our data centres, information access authorisation controls and ensuring our system complies with industry information security standards.{`\n\n`}
        We may share customers’ personal information with members of the Interswitch Group, regulators, law enforcement officials and other third parties.{`\n\n`}
        By clicking on the ‘I Agree’ checkbox, you are consenting to our full <Hyperlink onPress={() => Linking.openURL("https://www.interswitchgroup.com/ng/privacy-policy")}>Privacy Policy Here</Hyperlink>. For users below the age of 18, the consent should be provided by your lawful custodian/guardian. Please note, in case you choose not to provide us with your consent or withdraw your previous consent at any given point in time, we shall not be under any obligation to provide any services to you.
      </Text>
      <Text>
        
      </Text> */}
    </ScrollView>
  </Fragment>
};
