import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownMenu, DropdownToggle, DropdownItem, ButtonDropdown } from 'reactstrap';
import { gettext, isPro, enableFileComment, fileAuditEnabled, folderPermEnabled } from '../../utils/constants';
import '../../css/dirents-menu.css';

const propTypes = {
  dirents: PropTypes.array.isRequired,
  currentRepoInfo: PropTypes.object.isRequired,
  isRepoOwner: PropTypes.bool.isRequired,
  onMenuItemClick: PropTypes.func.isRequired,
};

class DirentMenu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isItemMenuShow: false,
      menuList: [],
    };
  }

  calculateMenuList(props) {
    const { currentRepoInfo, dirents, isRepoOwner } = props;
    const length = dirents.length;
    let menuList;
    if (length === 1) {
      if (dirents[0].type === 'dir') {
        menuList = ['Share'];
      }
      else if (dirents[0].type === 'file') {
        if (dirents[0].is_locked) {
          menuList = ['Share', 'Tag', 'Unlock', 'Details', 'Related Files', 'History', 'Open via Client'];
        }
        else {
          menuList = ['Share', 'Tag', 'Lock', 'Details', 'Related Files', 'History', 'Open via Client'];
        }
      }
    }
    else if (length > 1) {
      for (let i = 0; i < length; i++) {
        if (dirents[i].type === 'dir') {
          this.setState({
            menuList: [],
          });
          return;
          // 或者设置一个参数，直接界面中不显示菜单（hidden）
        }
      }
      menuList = ['Tag'];
    }
    this.setState({
      menuList: menuList,
    });
  }

  translateMenuItem = (menuItem) => {
    let translateResult = '';
    switch(menuItem) {
      case 'Share':
        translateResult = gettext('Share');
        break;
      case 'Tag':
        translateResult = gettext('Tag');
        break;
      case 'Details':
        translateResult = gettext('Details');
        break;
      case 'Lock':
        translateResult = gettext('Lock');
        break;
      case 'Unlock':
        translateResult = gettext('Unlock');
        break;
      case 'Related Files':
        translateResult = gettext('Related Files');
        break;
      case 'History':
        translateResult = gettext('History');
        break;
      case 'Open via Client':
        translateResult = gettext('Open via Client');
        break;
      default:
        break;
    }
    return translateResult;
  }

  onDropdownToggleClick = (e) => {
    e.preventDefault();
    this.setState({
      isItemMenuShow: !this.state.isItemMenuShow,
    });
  }

  onMenuItemClick = (event) => {
    let operation = event.target.dataset.toggle;
    this.props.onMenuItemClick(operation, this.props.path, this.props.dirents);
    // 将选中的部分传递过去处理, 还是 nextProps ?
  }

  componentDidMount() {
    this.calculateMenuList(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.dirents.length !== nextProps.dirents.length) {
      this.calculateMenuList(nextProps);
    }
  }

  render() {
    return (
      <ButtonDropdown isOpen={this.state.isItemMenuShow} toggle={this.onDropdownToggleClick} title={gettext('More Operations')}>
        <DropdownToggle data-toggle="dropdown" aria-expanded={this.state.isItemMenuShow} onClick={this.onDropdownToggleClick} className="sf2-icon-caret-down secondary group-op-item action-icon sf-dropdown-toggle dirents-more-menu">
        </DropdownToggle>
        <DropdownMenu>
          {this.state.menuList.map((menuItem, index) => {
            if (menuItem === 'Divider') {
              return <DropdownItem key={index} divider/>;
            } else {
              return (
                <DropdownItem key={index} data-toggle={menuItem} onClick={this.onMenuItemClick}>{this.translateMenuItem(menuItem)}</DropdownItem>
              );
            }
          })}
        </DropdownMenu>
      </ButtonDropdown>
    );
  }
}

DirentMenu.propTypes = propTypes;

export default DirentMenu;
