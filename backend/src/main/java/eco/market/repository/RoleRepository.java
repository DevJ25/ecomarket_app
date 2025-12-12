package eco.market.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import eco.market.model.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
}
