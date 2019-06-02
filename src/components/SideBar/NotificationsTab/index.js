import React from 'react';

const NotificationsTab = () => (
  <div role="tabpanel" className="tab-pane fade" id="notifications">
    <h4>Tasks</h4>
    <div className="tasks">
      <form role="form" id="add-tasks">
        <div className="input-group input-group-sm">
          <input type="text" className="form-control" id="custom-text" name="Item" placeholder="New Task"/>
          <span className="input-group-btn">
            <button type="submit" value="Add" className="btn add_button">
                <i className="fa fa-plus"></i>
            </button>
          </span>
        </div>
      </form>

      <ul className="tasks-list">
        <li className="task checked">
          <div className="check-task">
            <i className="fa fa-check"></i>
          </div>
          <div className="task-text">Task 1</div>
          <button className="btn delete-task">
            <i className="fa fa-times"></i>
          </button>
        </li>
        <li className="task checked">
          <div className="check-task">
            <i className="fa fa-check"></i>
          </div>
          <div className="task-text">Task 2</div>
          <button className="btn delete-task">
            <i className="fa fa-times"></i>
          </button>
        </li>
        <li className="task checked">
          <div className="check-task">
            <i className="fa fa-check"></i>
          </div>
          <div className="task-text">Task 3</div>
          <button className="btn delete-task">
            <i className="fa fa-times"></i>
          </button>
        </li>
        <li className="task">
          <div className="check-task">
            <i className="fa fa-check"></i>
          </div>
          <div className="task-text">Task 4</div>
          <button className="btn delete-task">
            <i className="fa fa-times"></i>
          </button>
        </li>
        <li className="task">
          <div className="check-task">
            <i className="fa fa-check"></i>
          </div>
          <div className="task-text">Task 5</div>
          <button className="btn delete-task">
            <i className="fa fa-times"></i>
          </button>
        </li>

        <script type="text/taskTemplate" id="taskTemplate">
          <li className="task">
            <div className="check-task">
              <i className="fa fa-check"></i>
            </div>
            <div className="task-text">{}</div>
            <button className="btn delete-task">
              <i className="fa fa-times"></i>
            </button>
          </li>
        </script>
      </ul>
    </div>

    <h4>Notifications</h4>
    <ul className="notifications">
      <li><a href="#" className="clearfix">
        <span className="icon"><i className="fa fa-user"></i></span>
        <div className="notification-details">
          <h6>New user registered.</h6>
          <span className="when">2 minutes ago</span>
        </div>
      </a></li>

      <li><a href="#" className="clearfix">
        <span className="icon"><i className="fa fa-envelope-o"></i></span>
        <div className="notification-details">
          <h6>New email received.</h6>
          <span className="when">3 minutes ago</span>
        </div>
      </a></li>

      <li><a href="#" className="clearfix">
        <span className="icon"><i className="fa fa-shopping-cart"></i></span>
        <div className="notification-details">
          <h6>New order received.</h6>
          <span className="when">4 minutes ago</span>
        </div>
      </a></li>

      <li><a href="#" className="clearfix">
        <span className="icon"><i className="fa fa-calendar-o"></i></span>
        <div className="notification-details">
          <h6>Event Invitation.</h6>
          <span className="when">5 minutes ago</span>
        </div>
      </a></li>

      <li><a href="#" className="clearfix">
        <span className="icon"><i className="fa fa-tasks"></i></span>
        <div className="notification-details">
          <h6>You have new tasks.</h6>
          <span className="when">6 minutes ago</span>
        </div>
      </a></li>

      <li><a href="#" className="clearfix">
        <span className="icon"><i className="fa fa-folder-open-o"></i></span>
        <div className="notification-details">
          <h6>New project assigned.</h6>
          <span className="when">7 minutes ago</span>
        </div>
      </a></li>
    </ul>
  </div>
);

export default NotificationsTab;
