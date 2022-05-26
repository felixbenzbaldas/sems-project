package sems;

public class SemsAddressParser {
	private String[] addressArray;
	private String addressString;
	public SemsAddressParser(String address) {
		this.addressString = address;
		addressArray = address.split("-");
	}
	
	public boolean hasSemsHouse() {
		return addressArray.length > 1;
	}
	
	public SemsHouse getSemsHouse() {
		return App.getSemsHouse(addressArray[0]);
	}
	
	public String getSemsName() {
		return addressArray[addressArray.length - 1];
	}
}