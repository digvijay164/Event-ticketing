// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Decentralized Event Ticketing Contract
/// @author
/// @notice Production-grade event organization & ticketing system
/// @dev Includes custom errors, reentrancy protection, and proper accounting

contract EventTicketing {
    // =============================================================
    //                           ERRORS
    // =============================================================

    error NotOrganizer();
    error EventNotFound();
    error EventAlreadyOccurred();
    error EventInPast();
    error InvalidTicketCount();
    error InsufficientTickets();
    error IncorrectETHAmount();
    error NoTicketsOwned();
    error NothingToWithdraw();
    error EventNotCompleted();

    // =============================================================
    //                           STRUCTS
    // =============================================================

    struct Event {
        address organizer;
        string name;
        uint256 date;
        uint256 price;
        uint256 totalTickets;
        uint256 ticketsRemaining;
        uint256 fundsCollected;
    }

    // =============================================================
    //                        STATE VARIABLES
    // =============================================================

    uint256 public nextEventId;

    mapping(uint256 => Event) private events;
    mapping(address => mapping(uint256 => uint256)) public ticketsOwned;

    // =============================================================
    //                            EVENTS
    // =============================================================

    event EventCreated(
        uint256 indexed eventId,
        address indexed organizer,
        string name,
        uint256 date,
        uint256 price,
        uint256 totalTickets
    );

    event TicketsPurchased(
        uint256 indexed eventId,
        address indexed buyer,
        uint256 quantity
    );

    event TicketsTransferred(
        uint256 indexed eventId,
        address indexed from,
        address indexed to,
        uint256 quantity
    );

    event FundsWithdrawn(
        uint256 indexed eventId,
        address indexed organizer,
        uint256 amount
    );

    // =============================================================
    //                           MODIFIERS
    // =============================================================

    modifier eventExists(uint256 _eventId) {
        if (events[_eventId].organizer == address(0)) revert EventNotFound();
        _;
    }

    modifier onlyOrganizer(uint256 _eventId) {
        if (msg.sender != events[_eventId].organizer) revert NotOrganizer();
        _;
    }

    // =============================================================
    //                        CREATE EVENT
    // =============================================================

    function createEvent(
        string calldata _name,
        uint256 _date,
        uint256 _price,
        uint256 _totalTickets
    ) external {
        if (_date <= block.timestamp) revert EventInPast();
        if (_totalTickets == 0) revert InvalidTicketCount();

        events[nextEventId] = Event({
            organizer: msg.sender,
            name: _name,
            date: _date,
            price: _price,
            totalTickets: _totalTickets,
            ticketsRemaining: _totalTickets,
            fundsCollected: 0
        });

        emit EventCreated(
            nextEventId,
            msg.sender,
            _name,
            _date,
            _price,
            _totalTickets
        );

        nextEventId++;
    }

    // =============================================================
    //                        BUY TICKETS
    // =============================================================

    function buyTickets(
        uint256 _eventId,
        uint256 _quantity
    ) external payable eventExists(_eventId) {
        Event storage e = events[_eventId];

        if (block.timestamp >= e.date) revert EventAlreadyOccurred();
        if (_quantity == 0) revert InvalidTicketCount();
        if (e.ticketsRemaining < _quantity) revert InsufficientTickets();

        uint256 totalCost = e.price * _quantity;
        if (msg.value != totalCost) revert IncorrectETHAmount();

        e.ticketsRemaining -= _quantity;
        e.fundsCollected += totalCost;
        ticketsOwned[msg.sender][_eventId] += _quantity;

        emit TicketsPurchased(_eventId, msg.sender, _quantity);
    }

    // =============================================================
    //                     TRANSFER TICKETS
    // =============================================================

    function transferTickets(
        uint256 _eventId,
        uint256 _quantity,
        address _to
    ) external eventExists(_eventId) {
        Event storage e = events[_eventId];

        if (block.timestamp >= e.date) revert EventAlreadyOccurred();
        if (ticketsOwned[msg.sender][_eventId] < _quantity)
            revert NoTicketsOwned();

        ticketsOwned[msg.sender][_eventId] -= _quantity;
        ticketsOwned[_to][_eventId] += _quantity;

        emit TicketsTransferred(_eventId, msg.sender, _to, _quantity);
    }

    // =============================================================
    //                      WITHDRAW FUNDS
    // =============================================================

    function withdrawFunds(
        uint256 _eventId
    ) external eventExists(_eventId) onlyOrganizer(_eventId) {
        Event storage e = events[_eventId];

        if (block.timestamp < e.date) revert EventNotCompleted();
        if (e.fundsCollected == 0) revert NothingToWithdraw();

        uint256 amount = e.fundsCollected;
        e.fundsCollected = 0;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");

        emit FundsWithdrawn(_eventId, msg.sender, amount);
    }

    // =============================================================
    //                        VIEW FUNCTIONS
    // =============================================================

    function getEvent(
        uint256 _eventId
    ) external view eventExists(_eventId) returns (Event memory) {
        return events[_eventId];
    }

    function getUserTickets(
        address _user,
        uint256 _eventId
    ) external view returns (uint256) {
        return ticketsOwned[_user][_eventId];
    }
}
