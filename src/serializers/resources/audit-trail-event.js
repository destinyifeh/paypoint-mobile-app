import moment from 'moment';


export default class AuditTrailEvent {
  constructor(props) {
    props && this.serializeFromApi(props);
  }

  serializeApiData(props) {    
    serializedData = {};
    Object.assign(serializedData, props);

    serializedData.formattedDate = moment(props.entryDate).format('dddd, Do MMMM YYYY');
    serializedData.formattedDateTime = moment(props.entryDate).format(`dddd, Do MMMM YYYY[ ${props.entryTime}]`);

    return serializedData;
  }
}
