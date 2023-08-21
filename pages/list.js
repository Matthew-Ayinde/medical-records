import React, { Component } from 'react';
import { Card, Input, Form } from 'semantic-ui-react';
import { Link } from '../routes';
import Layout from '../components/Layout';
import record from '../ethereum/record';
import web3 from '../ethereum/web3';
import { Router } from '../routes';

class RecordsList extends Component {
    state = {
        search: '',
        connectedAccount: null,
        records: null,
        isDoctor: false, // Add a new state to determine if the connected account is a doctor
    };

    async componentDidMount() {
        const accounts = await web3.eth.getAccounts();
        const connectedAccount = accounts[0];
        const isDoctor = await record.methods.getDoctors().call().then(doctorList => doctorList.includes(connectedAccount));
        console.log("Isdoctor", isDoctor)
        try {
            let records = [];
            
            if(isDoctor) {
                const allPatients = await record.methods.getPatients().call();
                console.log("allpatients", allPatients)
                for (const patientAddress of allPatients) {
                    const patientRecord = await record.methods.searchPatientDemographic(patientAddress).call({ from: patientAddress });
                    console.log("record", patientRecord)
                    records.push(patientRecord);
                }
    
                console.log("records", records)
    
                this.setState({
                    isDoctor,
                    connectedAccount,
                    records
                });
            }else {
                // If not a doctor, fetch patient records
                const patientRecord = await record.methods.searchPatientDemographic(connectedAccount).call({ from: connectedAccount });
                records.push(patientRecord);
                console.log("patientrecords", records)
                this.setState({ isDoctor, connectedAccount, records });
            }
        } catch (error) {
            console.log(error)
        }

    }

    static async getInitialProps() {
        const allRecords = await record.methods.getPatients().call();
        console.log("allRecords", allRecords)
        return { allRecords };
    }

    renderRecords() {
        const { allRecords } = this.props;
        const { search, connectedAccount, records, isDoctor } = this.state;

        if (!connectedAccount) {
            return <div>Loading...</div>;
        }

        let itemsToRender;

        itemsToRender = records.map((record, index) => ({
            header: record[1], // Assuming the name is at index 1
            description: (
                <Link route={`/record/${allRecords[index]}`}>
                    <a>View Record</a>
                </Link>
            ),
            fluid: true
        }));
    
        let filteredRecords = records; // Use the fetched records for filtering

        if (search) {
            filteredRecords = records.filter(record => record[1].toLowerCase().includes(search.toLowerCase())); // Filter records by name
        }

        return <Card.Group items={itemsToRender} />;
    }

    onSearch = async event => {
        event.preventDefault();
        Router.pushRoute(`/record/${this.state.search}`);
    };

    render() {
        return (
            <Layout>
                <div>
                    <Form onSubmit={this.onSearch}>
                        <Form.Field>
                            <Input
                                fluid
                                action={{ icon: 'search' }}
                                placeholder='Search...'
                                onChange={(event) => this.setState({ search: event.target.value })}
                            /><br />
                        </Form.Field>
                    </Form>
                    <h2>Medical Records List</h2>
                    {this.renderRecords()}
                </div>
            </Layout>
        );
    }
}

export default RecordsList;






// import React, { Component } from 'react';
// import { Card, Input, Form } from 'semantic-ui-react';
// import { Link } from '../routes';
// import Layout from '../components/Layout';
// import record from '../ethereum/record';
// import web3 from '../ethereum/web3';
// import { Router } from '../routes';

// class RecordsList extends Component {
    
//     state = { 
//         search: '',
//         connectedAccount: null,
//         records: null
//     };

//     async componentDidMount() {
//         const accounts = await web3.eth.getAccounts();
//         console.log("accounts", accounts)
//         const connectedAccount = accounts[0] // Get the currently connected Ethereum account
//         console.log("connectedAccount", connectedAccount)
//         const records = await record.methods.searchPatientDemographic(connectedAccount).call({from: connectedAccount});
//         console.log("records", records)
//         this.setState({ records }); // Set the connected account in state
//         this.setState({ connectedAccount }); // Set the connected account in state
//     }
    
//     static async getInitialProps() {
//         const allRecords = await record.methods.getPatients().call();
//         console.log("allPatientsRecords", allRecords)
//         return { allRecords};
//     }

 

//     renderRecords() {
//         const { allRecords } = this.props;
//         const { search, connectedAccount, records } = this.state;
//         console.log("render-records", records)
    
//         if (!connectedAccount) {
//             return <div>Loading...</div>;
//         }
    
//         const filteredRecords = allRecords.filter(address => address === connectedAccount);
    
//         let itemsToRender;
    
//         if (search) {
//             const searchFilteredRecords = filteredRecords.filter(address => address.includes(search));
//             itemsToRender = searchFilteredRecords;
//         } else {
//             itemsToRender = filteredRecords;
//         }
    
//         const renderedItems = itemsToRender.map(address => ({
//             header: records[1],
//             description: (
//                 <Link route={`/record/${address}`}>
//                     <a>View Record</a>
//                 </Link>
//             ),
//             fluid: true
//         }));
    
//         return <Card.Group items={renderedItems} />;
//     }
    
    

//     onSearch = async event => {
//         event.preventDefault(); //prevent browser from submitting form to back end server

//         Router.pushRoute(`/record/${this.state.search}`);
//     };

//     render() {
//         return (
//             <Layout>
//                 <div>
                   
//                     <Form onSubmit={this.onSearch}> 
//                         <Form.Field>
//                             <Input 
//                                 fluid 
//                                 action={{ icon: 'search' }} 
//                                 placeholder='Search...' 
//                                 onChange={(event) => this.setState({ search: event.target.value })}
//                             /><br/>
//                         </Form.Field>
//                     </Form>
//                      <h2>Medical Records List</h2>
//                     {this.renderRecords()}
//                 </div>
//             </Layout>
//         );
//     }
// }

// export default RecordsList;