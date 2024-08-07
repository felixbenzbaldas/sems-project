package nodomain.sems.deprecated;

import java.util.List;

public class Path {
    private List<String> listOfPathParts;

    public Path(List<String> listOfPathParts) {
        this.listOfPathParts = listOfPathParts;
    }

    public String getLastPart() {
        if (getLength() > 0) {
            return listOfPathParts.get(listOfPathParts.size() - 1);
        } else {
            throw new RuntimeException("path is empty");
        }
    }

    public int getLength() {
        return listOfPathParts.size();
    }

    public Path withoutLastPart() {
        return new Path(listOfPathParts.subList(0, listOfPathParts.size() - 1));
    }

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof Path) {
            return this.listOfPathParts.equals(((Path) obj).listOfPathParts);
        } else {
            return false;
        }
    }

    @Override
    public int hashCode() {
        return this.listOfPathParts.hashCode();
    }

    public List<String> toList() {
        return this.listOfPathParts;
    }
}
