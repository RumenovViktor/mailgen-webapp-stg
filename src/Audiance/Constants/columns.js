const reportColumns = [
{ 
    field: 'email', 
    headerName: 'Email', 
    width: 200
},
{
  field: 'firstName',
  headerName: 'First Name',
  width: 200,
},
{
  field: 'lastName',
  headerName: 'Last Name',
  width: 200,
  type: 'date',
},
{
  field: 'dateSubscribed',
  headerName: 'Subscribe Date',
  width: 220,
  type: 'date'
},
{
  field: 'isSubsciber',
  headerName: 'Is Subscriber',
  width: 220,
  type: 'boolean'
},
{
  field: 'modify',
  headerName: 'Modify',
  width: 220,
  type: 'string'
},
{
  field: 'delete',
  headerName: 'Delete',
  width: 220,
  type: 'string'
}];

export default reportColumns