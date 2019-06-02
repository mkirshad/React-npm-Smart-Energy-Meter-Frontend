import React from 'react';
import { Link, NavLink } from 'react-router-dom';

class NavigationTab extends React.Component {
  constructor() {
    super();
    this.state = {
      expanded: false,
      collapse: "collapse",
      expanded_1: false,
      collapse_1: "collapse",
      sty: '0px',
      styl: ['0px', '0px', '0px', '0px', '0px', '0px'],
      expnd: [false, false, false, false, false, false],
      collp: ["collapse", "collapse", "collapse", "collapse", "collapse", "collapse"],
      actv: ["", "", "", "", "", ""],
      act: ["abcd"],
      active_1: "",
      active_2: "",
      dashboard: "",
    };
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu(event) {
    event.preventDefault(); // Let's stop this event.
    event.stopPropagation(); // Really this time.

    var indx = event.currentTarget.dataset.id - 1;
    var newArray_act = this.state.actv.slice();
    var newArray_expnd = this.state.expnd.slice();
    var newArray_collp = this.state.collp.slice();
    var newArray_styl = this.state.styl.slice();

    for (let i = 0; i < 8; i++) {
      if (i === indx) {
        if (i === 6 || i === 7) {
          if (i === 6) {
            newArray_act[i - 1] = "active";
            newArray_expnd[i - 1] = true;
            newArray_collp[i - 1] = "collapse in ";
            newArray_styl[i - 1] = "";
          } else {
            newArray_act[i - 2] = "active";
            newArray_expnd[i - 2] = true;
            newArray_collp[i - 2] = "collapse in ";
            newArray_styl[i - 2] = "";

          }
        }

        if (newArray_act[indx] === "") {
          newArray_act[indx] = 'active';
        } else {
          newArray_act[indx] = "";
        }

        newArray_expnd[indx] = !newArray_expnd[indx];

        if (newArray_collp[indx] === "collapse") {
          newArray_collp[indx] = 'collapse in';
        } else {
          newArray_collp[indx] = "collapse";
        }

        if (newArray_styl[indx] === "0px") {
          newArray_styl[indx] = "";
        } else {
          newArray_styl[indx] = '0px';
        }

      } else {
        newArray_act[i] = "";
        newArray_expnd[i] = false;
        newArray_collp[i] = "collapse";
        newArray_styl[i] = '0px';
      }
    } //end for loop

    this.setState({ actv: newArray_act });
    this.setState({ expnd: newArray_expnd });
    this.setState({ collp: newArray_collp });
    this.setState({ styl: newArray_styl });
  }

  render() {
    return (
      <div role="tabpanel" className="tab-pane fade in active" id="nav">
        <h4>Smart Navigation</h4>
        <nav className="main-nav">
          <ul id="sidebar-nav" className="sidebar-nav">
            <li className={this.state.actv[0]}>
              <NavLink to="/roles" data-id="1" onClick={this.toggleMenu} activeClassName="side-nav-active"> {/*  to attribue  empty is creating issue*/}
                <i className="fa fa-tachometer fa-fw fa-lg" />
                System
                  <span
                  className="fa plus-times"
                  data-id="1"
                  onClick={this.toggleMenu}
                />
              </NavLink>
              <ul
                className={this.state.collp[0]}
                aria-expanded={this.state.expnd[0]}
                style={{ height: this.state.styl[0] }}
              >
                <li><NavLink to="/roles" activeClassName="side-nav-active"><i className="fa fa-check fa-fw fa-lg" />Role</NavLink></li>
                <li><NavLink to="/users" activeClassName="side-nav-active"><i className="fa fa-check fa-fw fa-lg" />User</NavLink></li>
                <li><NavLink to="/notice-management" activeClassName="side-nav-active"><i className="fa fa-check fa-fw fa-lg" />Notice Management</NavLink></li>
                <li><NavLink to="/operation-log" activeClassName="side-nav-active"> <i className="fa fa-check fa-fw fa-lg" /> Operating Log</NavLink></li>
                <li><NavLink to="/login-log" activeClassName="side-nav-active"> <i className="fa fa-check fa-fw fa-lg" /> Login Log </NavLink></li>
                <li><NavLink to="/notice" activeClassName="side-nav-active"> <i className="fa fa-check fa-fw fa-lg" /> My Notice </NavLink></li>
                <li><NavLink to="/subscribe" activeClassName="side-nav-active"> <i className="fa fa-check fa-fw fa-lg" /> Subscribe </NavLink></li>
              </ul>
            </li>
            <li className={this.state.actv[3]}>         
              <NavLink to="/remoting-reading" data-id="4" onClick={this.toggleMenu} activeClassName="side-nav-active">
                <i className="fa fa-desktop fa-fw fa-lg" />
                Remoting
                <span
                  className="fa plus-times"
                  data-id="4"
                  onClick={this.toggleMenu}
                />            
               </NavLink>
              <ul
                className={this.state.collp[3]}
                aria-expanded={this.state.expnd[3]}
                style={{ height: this.state.styl[3] }}
              >
                <li>
                  <NavLink to="/remoting-reading" activeClassName="side-nav-active">
                    <i className="fa fa-check fa-fw fa-lg" /> Reading
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/remoting-realtime-operating" activeClassName="side-nav-active">
                    <i className="fa fa-check fa-fw fa-lg" /> Realtime Operating
                  </NavLink>
                </li>
                
                
                <li>
                  <NavLink to="/remoting-settings"  activeClassName="side-nav-active"> {/* only anchor is refereshing the page (issue ) but navlink isn't  */}
                    <i className="fa fa-check fa-fw fa-lg" /> Settings                
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/remoting-scheduling"  activeClassName="side-nav-active"> {/* only anchor is refereshing the page (issue ) but navlink isn't  */}
                    <i className="fa fa-check fa-fw fa-lg" /> Scheduling                
                  </NavLink>
                </li>


                {/*
                <li>
                  <NavLink to="/remoting-advanced-settings" activeClassName="side-nav-active">
                    <i className="fa fa-check fa-fw fa-lg" /> Advanced Setting
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/remoting-security" activeClassName="side-nav-active">
                    <i className="fa fa-check fa-fw fa-lg" /> Security
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/remoting-terminal" activeClassName="side-nav-active">
                    <i className="fa fa-check fa-fw fa-lg" /> Terminal
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/remoting-meter-download" activeClassName="side-nav-active">
                    <i className="fa fa-check fa-fw fa-lg" /> Meter Download
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/remoting-tariff-update" activeClassName="side-nav-active">
                    <i className="fa fa-check fa-fw fa-lg" /> Tariff Update Result
                  </NavLink>
                </li>
                */}
              </ul>
            </li>
            {/*}
            <li className={this.state.actv[1]}>
              <a href="#" data-id="2" onClick={this.toggleMenu} aria-controls="emails" data-toggle="tab">
                <i className="fa fa-cogs fa-fw fa-lg" />
                Parameter
                <span
                  className="fa plus-times"
                  data-id="2"
                  onClick={this.toggleMenu}
                />
              </a>

              <ul
                className={this.state.collp[1]}
                aria-expanded={this.state.expnd[0]}
                style={{ height: this.state.styl[1] }}
              >
                <li><a href="#"><i className="fa fa-check fa-fw fa-lg" /> Supplier </a></li>
                <li><a href="#"><i className="fa fa-check fa-fw fa-lg" /> Meter Type </a></li>
                <li><a href="#"><i className="fa fa-check fa-fw fa-lg" /> TML Type </a></li>
                <li><a href="#"><i className="fa fa-check fa-fw fa-lg" /> Fee </a></li>
                <li><a href="#"><i className="fa fa-check fa-fw fa-lg" /> Tariff </a></li>
                <li><a href="#"><i className="fa fa-check fa-fw fa-lg" /> Supply Group </a></li>
                <li><a href="#"><i className="fa fa-check fa-fw fa-lg" /> Collect Plan </a></li>
                <li><a href="#"><i className="fa fa-check fa-fw fa-lg" /> Event </a></li>
              </ul>
            </li>
              */}
            
            {/*

            <li className={this.state.actv[2]}>
              <a href="#" data-id="3" onClick={this.toggleMenu}>
                <i className="fa fa-archive fa-fw fa-lg" />
                Archive
                <span
                  className="fa plus-times"
                  data-id="3"
                  onClick={this.toggleMenu}
                />
              </a>
              <ul className={this.state.collp[2]} aria-expanded={this.state.expnd[2]}
                style={{ height: this.state.styl[2] }}>
                <li><a href="#"><i className="fa fa-check fa-fw fa-lg" /> Customer </a></li>
                <li><a href="#"><i className="fa fa-check fa-fw fa-lg" /> Meter </a></li>
                <li><a href="#"><i className="fa fa-check fa-fw fa-lg" /> POC </a></li>
                <li><a href="#"><i className="fa fa-check fa-fw fa-lg" /> Terminal </a></li>
                <li><a href="#"><i className="fa fa-check fa-fw fa-lg" /> Sim Card </a></li>
                <li><a href="#"><i className="fa fa-check fa-fw fa-lg" /> Power Grid </a></li>
                <li><a href="#"><i className="fa fa-check fa-fw fa-lg" /> Installation Wizard </a></li>
                <li><a href="#"><i className="fa fa-check fa-fw fa-lg" /> Device Upgrade </a></li>
                <li><a href="#"><i className="fa fa-check fa-fw fa-lg" /> Line Loss </a></li>
                <li><a href="#"><i className="fa fa-check fa-fw fa-lg" /> Load Control </a></li>
              </ul>
            </li>
            */}
            <li className={this.state.actv[4]}>
              <NavLink to="/analysis-raw-data"  data-id="5" onClick={this.toggleMenu} activeClassName="side-nav-active">
                <i className="fa fa-line-chart fa-fw fa-lg" />
                Analysis
                <span className="fa plus-times" data-id="5" onClick={this.toggleMenu} />
              </NavLink>
              <ul
                className={this.state.collp[4]}
                aria-expanded={this.state.expnd[4]}
                style={{ height: this.state.styl[4] }}
              >
                {/*<li><a href="#"><i className="fa fa-check fa-fw fa-lg" /> Event Analysis </a></li>*/}
                <li>
                  <NavLink to="/analysis-raw-data" activeClassName="side-nav-active">
                    <i className="fa fa-check fa-fw fa-lg" /> Raw Data
                </NavLink>
                </li>
                <li>
                  <NavLink to="/analysis-monthly-consumption" activeClassName="side-nav-active">
                    <i className="fa fa-check fa-fw fa-lg" /> Monthly Consumption
                </NavLink>
                </li>
                <li>
                  <NavLink to="/analysis-daily-consumption" activeClassName="side-nav-active">
                    <i className="fa fa-check fa-fw fa-lg" /> Daily Consumption
                </NavLink>
                </li>
               
                <li>
                  <NavLink to="/analysis-hourly-consumption" activeClassName="side-nav-active">
                    <i className="fa fa-check fa-fw fa-lg" /> Hourly Consumption
                </NavLink>
                </li>
                {/*
                <li><a href="#"><i className="fa fa-check fa-fw fa-lg" /> Load Profile </a></li>
                <li><a href="#"><i className="fa fa-check fa-fw fa-lg" /> Consumption </a></li>
                <li><a href="#"><i className="fa fa-check fa-fw fa-lg" /> Max Demand </a></li>
                <li><a href="#"><i className="fa fa-check fa-fw fa-lg" /> Collect Analysis </a></li>
                <li><a href="#"><i className="fa fa-check fa-fw fa-lg" /> Online Rate </a></li>
                <li><a href="#"><i className="fa fa-check fa-fw fa-lg" /> Summary </a></li>
                <li><a href="#"><i className="fa fa-check fa-fw fa-lg" /> Task Analysis </a></li>
                <li><a href="#"><i className="fa fa-check fa-fw fa-lg" /> Line Loss </a></li>
                <li><a href="#"><i className="fa fa-check fa-fw fa-lg" /> Power Off Analysis </a></li>
                <li><a href="#"><i className="fa fa-check fa-fw fa-lg" /> Sms Log </a></li>
                <li><a href="#"><i className="fa fa-check fa-fw fa-lg" /> Billing Data </a></li>
                <li><a href="#"><i className="fa fa-check fa-fw fa-lg" /> Instantaneous Data </a></li>
                */}
              </ul>
            </li>

            {/*

            <li className={this.state.actv[5]}>
              <a href="#" data-id="6" onClick={this.toggleMenu} >
                <i className="fa fa-flag fa-fw fa-lg" />
                Report
                  <span
                  className="fa plus-times"
                  data-id="6"
                  onClick={this.toggleMenu}
                />
              </a>

              <ul
                className={this.state.collp[5]}
                aria-expanded={this.state.expnd[5]}
                style={{ height: this.state.styl[5] }}
              >
                <li className={this.state.actv[6]}>
                  <a href="#" data-id="7" onClick={this.toggleMenu} >
                    Collection Report
                    <span className="fa plus-times" data-id="7" onClick={this.toggleMenu} />
                  </a>
                  <ul
                    className={this.state.collp[6]}
                    aria-expanded={this.state.expnd[6]}
                    style={{ height: this.state.styl[6] }}
                  >
                    <li><a href="#"><i className="fa fa-check fa-fw fa-lg" /> Online Analysis</a></li>
                    <li><a href="#"><i className="fa fa-check fa-fw fa-lg" /> Monthly Consumption</a></li>
                    <li><a href="#"><i className="fa fa-check fa-fw fa-lg" /> Monthly Consumption Fail</a></li>
                  </ul>
                </li>
                <li
                  className={this.state.actv[7]}><a href="#" data-id="8" onClick={this.toggleMenu} 
                  >
                    Archive Report
                  <span className="fa plus-times" data-id="8" onClick={this.toggleMenu} /></a>
                  <ul
                    className={this.state.collp[7]}
                    aria-expanded={this.state.expnd[7]}
                    style={{ height: this.state.styl[7] }}
                  >
                    <li><a href="#"><i className="fa fa-check fa-fw fa-lg" />Meter Status</a></li>
                    <li><a href="#"><i className="fa fa-check fa-fw fa-lg" />Maintenance Report</a></li>
                    <li><a href="#"><i className="fa fa-check fa-fw fa-lg" />Installation Report</a></li>
                    <li><a href="#"><i className="fa fa-check fa-fw fa-lg" />Replacement Report</a></li>
                  </ul>
                </li>
                <li><a href="#">Billing Report </a></li>
              </ul>
            </li>

            */}

            {/*  only anchor is refereshing the page (issue ) but navlink isn't  
            <li className="">
              <NavLink to="/remoting-multi"  activeClassName="side-nav-active"> 
                <i className="fa fa-desktop fa-fw fa-lg" />
                REMOTING-multi

              </NavLink>
            </li>

            */}


          </ul>

        </nav>
      </div>
    )
  }
}

export default NavigationTab;
