
import React, { Component } from 'react';
import Grid from '../common/Grid';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as itemActions from '../../actions/itemActions';
import PropTypes from 'prop-types';
import DetailsModal from '../common/DetailsModal';
import DynamicButtonToolbar from '../common/DynamicButtonToolbar';
import ToastrPopup from '../common/ToastrPoup';
import ItemDetailsForm from './itemDetailsForm';
import { Container, Badge } from 'reactstrap';



class Item extends Component {

    constructor(props) {
        super(props);
        this.onAdd = this.onAdd.bind(this);
        this.onEdit = this.onEdit.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.closeDetailsModal = this.closeDetailsModal.bind(this);
        this.saveItem = this.saveItem.bind(this);
        this.state = { modalIsOpen: false, item: {}, itemTypes: [] };

        this.detailModal = React.createRef();
        this.itemDetailsGrid = React.createRef();
    }

    saveItem(item) {        
        return this.props.actions.saveItem(item);
    }

    onSave = () => {        
        this.detailModal.current.onSave();
    };

    onCancel = () => {       

        this.detailModal.current.onCancel();

    };

    componentDidMount() {
        this.props.actions.GetItems();
        this.props.actions.GetItemTypes();
    }

    closeDetailsModal() {
        this.setState({ modalIsOpen: false });
    }

    onAdd(event) {
        event.preventDefault();
        let item = { id: -1, name: '', date: '', price: 0, inStock: false, type: '' };
        this.setState({ modalIsOpen: true, item: item });
    }

    onEdit() {
        let selectedids = this.itemDetailsGrid.current.state.selectedRows;
        if (selectedids.length !== 1) {
            ToastrPopup.info('Please select one record to edit.');
            return;
        }
        let item = getItemById(this.props.items, selectedids[0]);        
        this.setState({ modalIsOpen: true, itemId: 1, item: item });
        this.itemDetailsGrid.current.setState({ selectedRows: [] });
    }

    onDelete() {
        let selectedids = this.itemDetailsGrid.current.state.selectedRows;
        if (selectedids.length !== 1) {
            ToastrPopup.info('Please select one record to delete.');
            return;
        }
        let item = getItemById(this.props.items, selectedids[0]);
        this.props.actions.deleteItem(item)
            .then()
            .catch(error => {
                ToastrPopup.error(error);
                this.setState({ saving: false });
            });
    }
    render() {      
        //let item = { id: '', name: '', date: '', price: 0, inStock: false, type: '' };
        return (
            <Container >
                <header className="App-header">
                    <h2 className="App-title"><Badge color="info">Items</Badge></h2>

                </header>
                <DynamicButtonToolbar buttons={[{
                    id: 'btnadd',
                    text: 'Add',
                    style: 'warning',
                    handler: this.onAdd
                },
                {
                    id: 'btnedit',
                    text: 'Edit',
                    style: 'info',
                    handler: this.onEdit
                },
                {
                    id: 'btnDelete',
                    text: 'Delete',
                    style: 'info',
                    handler: this.onDelete

                }]} />
                <div>
                    <Grid ref={this.itemDetailsGrid} data={this.props.items}
                        columns={[{
                            dataField: 'id',
                            text: 'ID',
                            sort: true,
                            hidden: true
                        }, {
                            dataField: 'name',
                            text: 'Item Name',
                            sort: true
                        }, {
                            dataField: 'price',
                            text: 'Item Price',
                            sort: true
                        }, {
                            dataField: 'inStockStr',
                            text: 'In Stock'
                        }
                        
                        ]} />
                </div>
                <DetailsModal modalIsOpen={this.state.modalIsOpen} badgeHeader={this.state.item.id === -1 ? "Add - Item" : "Edit Item"}
                    modalHeader={this.state.item.id === -1 ? "New Item" : this.state.item.name}
                    onSave={this.onSave}
                    onCancel={this.onCancel}
                >
                    <div><ItemDetailsForm ref={this.detailModal} item={this.state.item} itemTypes={this.props.itemTypes} closeHandler={this.closeDetailsModal} saveItem={this.saveItem} /></div>
                </DetailsModal>
            </Container>
        );
    }
}

Item.propTypes = {
    items: PropTypes.array
};

function getItemById(items, id) {
    const item = items.filter(item => item.id === id);
    if (item) return item[0]; //since filter returns an array, have to grab the first.
    return null;
}

function mapStateToProps(state, ownProps) {
    
    
    return {
        itemTypes: state.itemTypes,
    
        items: state.items
    }
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(itemActions, dispatch)
}
)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Item)
