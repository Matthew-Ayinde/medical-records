import { createMedia } from '@artsy/fresnel'
import PropTypes from 'prop-types'
import React, { Component, useState } from 'react'
import { Link } from '../routes';
import { Router } from '../routes';
import record from '../ethereum/record';
import web3 from '../ethereum/web3';
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  List,
  Menu,
  Segment,
  Sidebar,
  Visibility,
  Dropdown
} from 'semantic-ui-react'
// import "../styles/global.scss"

const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    mobile: 0,
    tablet: 768,
    computer: 1024,
  },
})

const HomepageHeading = ({ mobile, isWalletNotConnected, setIsWalletNotConnected }) => {
  // Calls Metamask to connect wallet on clicking Connect Wallet button
  const connectWallet = async () => {

    // setCheckingUserConnectivity(true);

    try {
      // const { ethereum } = window
      const ethereum = 'ethereum' in window ? window.ethereum : undefined;
      if (!ethereum) {
        console.log('Metamask is not detected');
        return;
      }

      // await window.web3.currentProvider.enable()

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

      if (accounts && accounts.length > 0) {

        console.log('Found account', accounts[0])

        // Set user account 
        // setCurrentAccount(accounts[0]);

        // retrieveBalance(ethereum, accounts);

        setIsWalletNotConnected(false)

        return;
      }

      // Update user connectivity status 
      setIsWalletNotConnected(true)

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Container text>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css"></link>
      <link rel="stylesheet" href="../styles/global.scss"></link>
      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 2, width: '100%', height: '100%', backgroundColor: '#000000' }}>
            <span style={{opacity: 0.5}}> 
            <Image opacity="0.5" width="100%" height="100%" objectFit="cover" position="absolute" src='https://res.cloudinary.com/dxwpajciu/image/upload/v1692035296/imgt_yigsgr.jpg' />
            </span>
      </div>

      {/* <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 1, width: '100%', height: '100%', backgroundImage: './imgt.jpg'}}> IMAGE </div> */}
      <Header
        as='h1'
        content='Blockchain Medical Record System'
        inverted
        style={{
          fontSize: mobile ? '2em' : '4em',
          fontWeight: 'normal',
          marginBottom: 0,
          marginTop: mobile ? '1.5em' : '3em',
          fontFamily: 'Georgia',
          zIndex: 5,
          position: 'relative'
        }}
      />
      <Header
        as='h2'
        content='Ensure that your records are safe and sound'
        inverted
        style={{
          fontSize: mobile ? '1.5em' : '1.7em',
          fontWeight: 'normal',
          marginTop: mobile ? '0.5em' : '1.5em',
          zIndex: 5,
          position: 'relative'
        }}
      />
      {isWalletNotConnected &&
        <>
          <Button style={{zIndex: 5, position: "relative"}} primary size='huge' inverted onClick={() => {
            // function here... 
            connectWallet(setIsWalletNotConnected)
          }}>
            <a className='item' style={{color: 'white'}}>Connect Wallet</a>
            {/* <Icon name='right arrow' /> */}
          </Button>

        </>
      }

    </Container>
  )
}

HomepageHeading.propTypes = {
  mobile: PropTypes.bool,
}

class DesktopContainer extends Component {
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

  hideFixedMenu = () => this.setState({ fixed: false })
  showFixedMenu = () => this.setState({ fixed: true })

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
    const { children, isWalletNotConnected, setIsWalletNotConnected } = this.props;
    const { isDoctorConnected, isPatientConnected } = this.state;

    return (
      <Media greaterThan='mobile'>
        <Visibility
          // ... other Visibility props
          once={false}
          onBottomPassed={this.showFixedMenu}
          onBottomPassedReverse={this.hideFixedMenu}
        >
          <Segment
            // inverted
            textAlign='center'
            style={{ zIndex: 1, minHeight: 700, zIndex: 5, position: 'relative', padding: '1em 0em',  }}
            vertical
          >  
            <Menu size='large' inverted style={{ zIndex: 5, position: 'relative', background: 'transparent' }}>
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
            <HomepageHeading
              // ... other props
              isWalletNotConnected={isWalletNotConnected}
              setIsWalletNotConnected={setIsWalletNotConnected}
            />
          </Segment>
        </Visibility>

        {children}
      </Media>
    );
  }



  // render() {
  //   const { children, isWalletNotConnected, setIsWalletNotConnected } = this.props;

  //   return (

  //     <Media greaterThan='mobile'>
  //       <Visibility
  // once={false}
  // onBottomPassed={this.showFixedMenu}
  // onBottomPassedReverse={this.hideFixedMenu}
  //       >
  //         <Segment
  //           inverted
  //           textAlign='center'
  //           style={{ minHeight: 700, padding: '1em 0em' }}
  //           vertical
  //         >
  //           <Menu size='large' inverted>
  //             <Link route='/'>
  //               <a className='item'>Home</a>
  //             </Link>

  //             <Menu.Menu position='right'>
  //               {isWalletNotConnected ?
  // <Dropdown item text='Register'>
  // <Dropdown.Menu>
  //   <Dropdown.Item>
  //     <Link route='/register-patient'>
  //       <a style={{ color: 'black' }}>Patient</a>
  //     </Link>
  //   </Dropdown.Item>
  //   <Dropdown.Item>
  //     <Link route='/register-doctor'>
  //       <a style={{ color: 'black' }}>Doctor</a>
  //     </Link>
  //   </Dropdown.Item>
  // </Dropdown.Menu>
  // </Dropdown>: 
  //                 <>
  //                   <Link route='/dashboard'>
  //                     <a className='item'>Dashboard</a>
  //                   </Link>

  // <Link route='/list'>
  //   <a className='item'>Records List</a>
  // </Link>

  //                   <Dropdown item text='Doctor'>
  // <Dropdown.Menu>
  //   <Dropdown.Item>
  //     <Link route='/'>
  //       <a style={{ color: 'black' }} onClick={this.onClickedDoctor}>View Profile</a>
  //     </Link>
  //   </Dropdown.Item>
  //   <Dropdown.Item>
  //     <Link route='/edit-doctor'>
  //       <a style={{ color: 'black' }}>Edit Profile</a>
  //     </Link>
  //   </Dropdown.Item>
  //   <Dropdown.Item>
  //     <Link route='/make-appointment'>
  //       <a style={{ color: 'black' }}>Make Appointment</a>
  //     </Link>
  //   </Dropdown.Item>
  //   <Dropdown.Item>
  //     <Link route='/edit-appointment'>
  //       <a style={{ color: 'black' }}>Update Appointment</a>
  //     </Link>
  //   </Dropdown.Item>
  // </Dropdown.Menu>
  //                   </Dropdown>

  // <Dropdown item text='Patient'>
  // <Dropdown.Menu>
  //   <Dropdown.Item>
  //     <Link route='/'>
  //       <a style={{ color: 'black' }} onClick={this.onClickedPatient}>View Profile</a>
  //     </Link>
  //   </Dropdown.Item>
  //   <Dropdown.Item>
  //     <Link route='/edit-patient'>
  //       <a style={{ color: 'black' }}>Edit Profile</a>
  //     </Link>
  //   </Dropdown.Item>
  //   <Dropdown.Item>
  //     <Link route='/approve-doctor'>
  //       <a style={{ color: 'black' }}>Allow Access</a>
  //     </Link>
  //   </Dropdown.Item>
  //   <Dropdown.Item>
  //     <Link route='/revoke-doctor'>
  //       <a style={{ color: 'black' }}>Revoke Access</a>
  //     </Link>
  //   </Dropdown.Item>
  // </Dropdown.Menu>
  // </Dropdown>

  //                   <Dropdown item text='Register'>
  //                     <Dropdown.Menu>
  //                       <Dropdown.Item>
  //                         <Link route='/register-patient'>
  //                           <a style={{ color: 'black' }}>Patient</a>
  //                         </Link>
  //                       </Dropdown.Item>
  //                       <Dropdown.Item>
  //                         <Link route='/register-doctor'>
  //                           <a style={{ color: 'black' }}>Doctor</a>
  //                         </Link>
  //                       </Dropdown.Item>
  //                     </Dropdown.Menu>
  //                   </Dropdown>
  //                 </>
  //               }


  //             </Menu.Menu>
  //           </Menu>
  //           <HomepageHeading 
  //             // mobile
  // isWalletNotConnected={isWalletNotConnected}
  // setIsWalletNotConnected={setIsWalletNotConnected}
  //           />
  //         </Segment>
  //       </Visibility>

  //       {children}
  //     </Media>
  //   )
  // }
}

DesktopContainer.propTypes = {
  children: PropTypes.node,
}

class MobileContainer extends Component {
  state = {
    sidebarOpened: false,
  }

  handleSidebarHide = () => this.setState({ sidebarOpened: false })
  handleToggle = () => this.setState({ sidebarOpened: true })

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
    const { children, isWalletNotConnected, setIsWalletNotConnected } = this.props;
    const { sidebarOpened } = this.state;

    return (
      <Media as={Sidebar.Pushable} at='mobile'>
        <Sidebar.Pushable>
          <Sidebar
            as={Menu}
            animation='overlay'
            inverted
            onHide={this.handleSidebarHide}
            vertical
            visible={sidebarOpened}
          >
            <Link route='/'>
              <a className='item'>Home</a>
            </Link>

            <Link route='/dashboard'>
              <a className='item'>Dashboard</a>
            </Link>

            <Link route='/list'>
              <a className='item'>Records List</a>
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
          </Sidebar>

          <Sidebar.Pusher dimmed={sidebarOpened}>
            <Segment
              inverted
              textAlign='center'
              style={{ minHeight: 350, padding: '1em 0em' }}
              vertical
            >
              <Container>
                <Menu inverted pointing secondary size='large'>
                  <Menu.Item onClick={this.handleToggle}>
                    <Icon name='sidebar' />
                  </Menu.Item>
                </Menu>
              </Container>
              <HomepageHeading
                mobile
                isWalletNotConnected={isWalletNotConnected}
                setIsWalletNotConnected={setIsWalletNotConnected}
              />
            </Segment>

            {children}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Media>
    )
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node,
}

const ResponsiveContainer = ({ children }) => {
  const [isWalletNotConnected, setIsWalletNotConnected] = useState(true);

  return (
    <MediaContextProvider>
      <DesktopContainer
        isWalletNotConnected={isWalletNotConnected}
        setIsWalletNotConnected={setIsWalletNotConnected}
      >
        {children}
      </DesktopContainer>
      <MobileContainer
        isWalletNotConnected={isWalletNotConnected}
        setIsWalletNotConnected={setIsWalletNotConnected}
      >
        {children}
      </MobileContainer>
    </MediaContextProvider>
  );
};


ResponsiveContainer.propTypes = {
  children: PropTypes.node,
}

const HomepageLayout = () => (
  <ResponsiveContainer>
    <Segment style={{ padding: '8em 0em' }} vertical>
      <Grid container stackable verticalAlign='middle'>
        <Grid.Row>
          <Grid.Column width={8}>
            <Header as='h3' style={{ fontSize: '2em' }}>
              We Help Companies and Companions
            </Header>
            <p style={{ fontSize: '1.33em' }}>
              We can give your company superpowers to do things that they never thought possible.
              Let us delight your customers and empower your needs... through reliable medical record systems.
            </p>
            <Header as='h3' style={{ fontSize: '2em' }}>
              We Make Blockchain Medical Systems
            </Header>
            <p style={{ fontSize: '1.33em' }}>
              Yes that's right, beautifully designed and easy to use medical record systems.
            </p>
          </Grid.Column>
          <Grid.Column floated='right' width={6}>
            <Image bordered rounded size='large' src='https://cdn.stocksnap.io/img-thumbs/960w/male-doctor_KN1OCKC4Y2.jpg' />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column textAlign='center'>
            <Button size='huge'>Check Us Out</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>

    <Segment style={{ padding: '0em' }} vertical>
      <Grid celled='internally' columns='equal' stackable>
        <Grid.Row textAlign='center'>
          <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
            <Header as='h3' style={{ fontSize: '2em' }}>
              "Easy to use, Reliable, Secure"
            </Header>
            <p style={{ fontSize: '1.33em' }}>That is what they all say about us</p>
          </Grid.Column>
          <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
            <Header as='h3' style={{ fontSize: '2em' }}>
              "One of the Best Blockchain Medical Record Systems available."
            </Header>
            <p style={{ fontSize: '1.33em' }}>
              <Image avatar src='https://365psd.com/images/istock/previews/8717/87172655-female-doctor-icon-nurse-symbol-faceless-woman-doctor-with-a-stethoscope.jpg' />
              <b>Dr Lim</b>, Surgeon at Pantai Hospital
            </p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>

    <Segment style={{ padding: '8em 0em' }} vertical>
      <Container text>
        <Header as='h3' style={{ fontSize: '2em' }}>
          Major Issue with Medical Record Systems
        </Header>
        <p style={{ fontSize: '1.33em' }}>
          Hospital emergency department (ED) found that doctors spent 43% of their time on data entry.
          Only 28% of the doctors make direct patient contact.
        </p>
        <Button as='a' size='large'>
          Read More
        </Button>

        <Divider
          as='h4'
          className='header'
          horizontal
          style={{ margin: '3em 0em', textTransform: 'uppercase' }}
        >
          <a href='#'>Case Studies</a>
        </Divider>

        <Header as='h3' style={{ fontSize: '2em' }}>
          Is Blockchain the best step forward for Medical Record Systems?
        </Header>
        <p style={{ fontSize: '1.33em' }}>
          Blockchain technology has the potential to enable more secure, transparent, and equitable data management.
          In addition to securely managing data, blockchain has significant advantages in distributing data access, control, and ownership to end users.
        </p>
        <Button as='a' size='large'>
          View Research
        </Button>
      </Container>
    </Segment>

    <Segment inverted vertical style={{ padding: '5em 0em' }}>
      <Container>
        <Grid divided inverted stackable>
          <Grid.Row>
            <Grid.Column width={3}>
              <Header inverted as='h4' content='About' />
              <List link inverted>
                <List.Item as='a'>Sitemap</List.Item>
                <List.Item as='a'>Contact Us</List.Item>
                <List.Item as='a'>Creator Info</List.Item>
                <List.Item as='a'>Site Details</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={3}>
              <Header inverted as='h4' content='Services' />
              <List link inverted>
                <List.Item as='a'>Create Blockchain System</List.Item>
                <List.Item as='a'>Store Medical Record</List.Item>
                <List.Item as='a'>How To Access</List.Item>
                <List.Item as='a'>Favorite Ducks</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={7}>
              <Header as='h4' inverted>
                Footer Header
              </Header>
              <p>
                Extra space for a call to action inside the footer that could help re-engage users.
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </Segment>
  </ResponsiveContainer>
)

export default HomepageLayout