import * as React from 'react'
import * as faker from 'faker';
import DataTable from './Data-table'

function generateFakeUsers(count: number = 10): object[] {
  const users = Array.from({ length: count }).map((u) => {
    return {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      address: faker.address.streetAddress(),
      zipCode: faker.address.zipCode(),
      phone: faker.phone.phoneNumber(),
    }
  })
  return users;
}


function rowRenderer(row: any, index: number, key: string) {
  switch (key) {
    case "firstName": return row.firstName
    case "lastName": return row.lastName
    case "address": return row.address
    case "zipCode": return row.zipCode
    case "phone": return row.phone
    default:
      return "None"
  }
}

function rowModifier(row: any) {
  row.id = faker.random.uuid();
  return row;
}

export default class App extends React.Component {
  state = {
    columns: [
      "firstName", "lastName", "address", "zipCode", "phone"
    ],
    rows: generateFakeUsers()
  }

  columnSort = (col: any) => {
    const { key } = col;

    const rows = this.state.rows.sort((a: any, b: any) => {
      const colA = a[key].toLowerCase();
      const colB = a[key].toLowerCase();

      if(colA > colB){
        return 1
      }

      return -1

    });

    this.setState({
      rows,
    })
  }

  render() {
    return (
      <DataTable
        rowModifier={rowModifier}
        fakeRows={10}
        minWidth={"400px"}
        height={"700px"}
        expandable={false}
        rowRenderer={rowRenderer}
        onRowClick={(row) => { }}
        columnSort={this.columnSort}
        rows={this.state.rows}
        columns={this.state.columns}
      />
    );
  }
}
