import React, { Component } from 'react';
import { Menu, Icon, Dropdown } from 'semantic-ui-react';
import record from '../ethereum/record';
import web3 from '../ethereum/web3';
import { Link } from '../routes';
import { Router } from '../routes';

//Header that is used in all pages

export default class MenuBar extends Component {

  state = {
    isDoctorConnected: false,
    isPatientConnected: false,
  }

  async componentDidMount() {
    // Get the connected account address
    const accounts = await web3.eth.getAccounts();
    const connectedAccount = accounts[0];

    // Check if the connected account is a doctor
    // const isDoctor = await record.methods.isDoctor(connectedAccount).call();
    
    // Check if the connected account is a patient
    // const isPatient = await record.methods.isPatient(connectedAccount).call();

    console.log("connected Account", connectedAccount)

    const isDoctor = await record.methods.getDoctors().call()
      .then(doctorList => doctorList.includes(connectedAccount));

    
    console.log("All doctors", await record.methods.getDoctors().call())

    // Check if the connected account is a patient
    const isPatient = await record.methods.getPatients().call()
      .then(patientList => patientList.includes(connectedAccount));

    console.log("All patients", await record.methods.getPatients().call())
    console.log("is-patient", isPatient)

    this.setState({
      isDoctorConnected: isDoctor,
      isPatientConnected: isPatient,
    });
  }

  onClickedPatient = async event => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    Router.pushRoute(`/record/${accounts[0]}`);
  }

  onClickedDoctor = async event => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    Router.pushRoute(`/doctor/${accounts[0]}`);
  }

  render() {
    const { isDoctorConnected, isPatientConnected } = this.state;
    return (
      <Menu size='large' inverted >
              <Link route='/'>
                <a className='item'>Home</a>
              </Link>

              <Menu.Menu position='right'>
                {isDoctorConnected || isPatientConnected ? (
                <>
                    {/* Common menu items for both doctor and patient */}

                    <Link route='/list'>
                      <a className='item'>Records List</a>
                    </Link>

                    {/* Dropdowns specific to doctor */}
                    {isDoctorConnected && (
                      <>
                        <Link route='/dashboard'>
                          <a className='item'>Dashboard</a>
                        </Link>
                        <Dropdown item text='Doctor'>
                          <Dropdown.Menu>
                            <Dropdown.Item>
                              <Link route='/'>
                                <a style={{ color: 'black' }} onClick={this.onClickedDoctor}>View Profile</a>
                              </Link>
                            </Dropdown.Item>
                            <Dropdown.Item>
                              <Link route='/edit-doctor'>
                                <a style={{ color: 'black' }}>Edit Profile</a>
                              </Link>
                            </Dropdown.Item>
                            <Dropdown.Item>
                              <Link route='/make-appointment'>
                                <a style={{ color: 'black' }}>Make Appointment</a>
                              </Link>
                            </Dropdown.Item>
                            <Dropdown.Item>
                              <Link route='/edit-appointment'>
                                <a style={{ color: 'black' }}>Update Appointment</a>
                              </Link>
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown item text='Patient'>
                          <Dropdown.Menu>
                            <Dropdown.Item>
                              <Link route='/'>
                                <a style={{ color: 'black' }} onClick={this.onClickedPatient}>View Profile</a>
                              </Link>
                            </Dropdown.Item>
                            <Dropdown.Item>
                              <Link route='/edit-patient'>
                                <a style={{ color: 'black' }}>Edit Profile</a>
                              </Link>
                            </Dropdown.Item>
                            <Dropdown.Item>
                              <Link route='/approve-doctor'>
                                <a style={{ color: 'black' }}>Allow Access</a>
                              </Link>
                            </Dropdown.Item>
                            <Dropdown.Item>
                              <Link route='/revoke-doctor'>
                                <a style={{ color: 'black' }}>Revoke Access</a>
                              </Link>
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown item text='Register'>
                          <Dropdown.Menu>
                            <Dropdown.Item>
                              <Link route='/register-patient'>
                                <a style={{ color: 'black' }}>Patient</a>
                              </Link>
                            </Dropdown.Item>
                            <Dropdown.Item>
                              <Link route='/register-doctor'>
                                <a style={{ color: 'black' }}>Doctor</a>
                              </Link>
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </>
                    )}

                    {/* Dropdowns specific to patient */}
                    {isPatientConnected && (
                      <>
                        {/* <Link route='/list'>
                        <a className='item'>Records List</a>
                        </Link> */}
                        <Dropdown item text='Patient'>
                          <Dropdown.Menu>
                            <Dropdown.Item>
                              <Link route='/'>
                                <a style={{ color: 'black' }} onClick={this.onClickedPatient}>View Profile</a>
                              </Link>
                            </Dropdown.Item>
                            <Dropdown.Item>
                              <Link route='/edit-patient'>
                                <a style={{ color: 'black' }}>Edit Profile</a>
                              </Link>
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </>
                    )}
                  </>
                ) : (
                  // Render wallet connect buttons if no role is determined
                  <Dropdown item text='Register'>
                    <Dropdown.Menu>
                      <Dropdown.Item>
                        <Link route='/register-patient'>
                          <a style={{ color: 'black' }}>Patient</a>
                        </Link>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </Menu.Menu>
            </Menu>  
    );
  }
}